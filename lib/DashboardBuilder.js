// Includes
const fs = require('fs');

class DashboardBuilder {
    
    constructor() {}

    build(pBuilder, dashboardBasePath, rowElementPath, dashboardBase, plotlyPanelElementPath, plotlyPanelsPath) {
        let dashboardBaseTemplate = JSON.parse(fs.readFileSync(dashboardBasePath, { encoding: 'utf8', flag: 'r' }));
        const rowBase = JSON.parse(fs.readFileSync(rowElementPath, { encoding: 'utf8', flag: 'r' }));
        let dashboardBaseObj = JSON.parse(fs.readFileSync(dashboardBase, { encoding: 'utf8', flag: 'r' }));

        let panels = [];

        // Kind of layout building
        let globalY = 0;

        for (const [k, row] of Object.entries(dashboardBaseTemplate["rows"])) {
            // Detected a ROW
            if (row.length === 1 && row[0]["type"] === "row") {
                const current = row[0];
                let newRow = Object.assign({}, rowBase);
            
                newRow["gridPos"] = {
                    "h": current["h"],
                    "w": current["w"],
                    "x": 0,
                    "y": globalY
                };

                newRow["title"] = current["title"];
                newRow["id"] = current["id"];

                // We will know the Y for the next ROW
                globalY += current["h"];

                panels.push(newRow);
            }

            if (row.length > 1) {
                let x = 0;
                let localY = 0;
                row.forEach(item => {
                    let newPanel = JSON.parse(fs.readFileSync(plotlyPanelElementPath, { encoding: 'utf8', flag: 'r' }));
                    
                    newPanel["gridPos"] = {
                        "h": item["h"],
                        "w": item["w"],
                        "x": x,
                        "y": globalY
                    };

                    x += item["w"];

                    if (item["h"] > localY) {
                        localY = item["h"];
                    }

                    const attrs = pBuilder.build(plotlyPanelsPath + "/" + item["source"]);
                    
                    console.log(item["source"]);

                    newPanel["options"]["layout"] = attrs["options"]["layout"];
                    newPanel["options"]["script"] = attrs["options"]["script"];
                    newPanel["options"]["onclick"] = attrs["options"]["onclick"];

                    newPanel["targets"][0]["table"] = attrs["targets"]["table"];
                    newPanel["targets"][0]["database"] = attrs["targets"]["database"];
                    newPanel["targets"][0]["query"] = attrs["targets"]["query"];

                    newPanel["id"] = item["id"];
                    newPanel["title"] = item["title"];

                    panels.push(newPanel);
                });

                // We will know the Y for the next ROW
                globalY += localY;
            }
        }

        dashboardBaseObj["panels"] = panels;

        // Add filters
        const hostnamesFilter = fs.readFileSync('./templates/filters/hosts.json', {encoding:'utf8', flag:'r'});
        const buckersFilter = fs.readFileSync('./templates/filters/buckets.json', {encoding:'utf8', flag:'r'});
        const devicesFilter = fs.readFileSync('./templates/filters/devices.json', {encoding:'utf8', flag:'r'});

        const filters = [
            JSON.parse(hostnamesFilter),
            JSON.parse(buckersFilter),
            JSON.parse(devicesFilter)
        ];

        dashboardBaseObj['templating']['list'] = filters;
        dashboardBaseObj['title'] = dashboardBaseTemplate["title"];

        return dashboardBaseObj;
    }
}

module.exports = DashboardBuilder;