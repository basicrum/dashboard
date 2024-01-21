// Includes
const fs = require('fs');
const BuilderFactory = require('./BuilderFactory');
const builderFactory = new BuilderFactory()

const rootPath = __dirname + '/../../';
const dashboardTemplatePath = rootPath + '/templates/dashboards/General.base.json';

const maxWidth = 24;

class DashboardBuilder {
    
    constructor() {}

    build(dashboardName, options) {
        const result = this.loadJSON(dashboardTemplatePath);

        const dashboardDefinition = this.loadDashboardDefinition(dashboardName);
        this.addTitle(result, dashboardDefinition);
        this.addFilters(result, dashboardDefinition, options);
        this.addPanels(result, dashboardDefinition, options, dashboardName);

        const path = `./build/dashboards/${dashboardName}.json`;
        this.writeDashboard(path, result);
        return {
            "name": dashboardName,
            "panels": result.panels.length,
            "path": path
        }
    }
    
    loadDashboardDefinition(dashboardName) {
        return this.loadJSON(rootPath + `/dashboards/defs/${dashboardName}.json`);
    }

    writeDashboard(path, result) {
        this.writeJSON(path, result);
    }

    addTitle(result, dashboardDefinition) {
        result['title'] = dashboardDefinition["title"];
        result['uid'] = dashboardDefinition["uid"];
    }

    addFilters(result, dashboardDefinition, options) {
        result['templating']['list'] = this.buildFilters(dashboardDefinition["filters"], options);
    }

    addPanels(result, dashboardDefinition, options, dashboardName) {
        result["panels"] = this.buildPanels(dashboardDefinition["rows"], options, dashboardName);
    }

    buildFilters(filters, options) {
        var result = [];
        for (var filterName of filters) {
            const newFilterName = options["filterMap"][filterName];
            if (newFilterName) {
                filterName = newFilterName;
            }
            result.push(this.loadJSON(`./templates/filters/${filterName}.json`));
        }
        return result;
    }

    buildPanels(rows, options, dashboardName) {
        let result = [];

        console.log("")
        let currentY = 0;
        let currentID = 1;
        for(const row of rows) {
            const calculateWidth = maxWidth / row.length;
            let panelMaxHeight = 0;
            let currentX = 0;
            for(const column of row) {
                const columnType = column["type"];
                if (columnType == "none") {
                    continue
                }
                const builder = builderFactory.create(columnType);
                const panel = builder.build(column["source"], column["variables"] || {}, options);
                
                const panelX = this.makePanelX(currentX, column);
                const panelY = this.makePanelY(currentY, column);
                const panelWidth = this.makePanelWidth(calculateWidth, column);
                const panelHeight = this.makePanelHeight(builder, column);
                this.updatePanel(panel, column, currentID, panelX, panelY, panelWidth, panelHeight);
                
                console.log(dashboardName + ": add panel " + panel.title)
                result.push(panel);

                currentID++;
                currentX += panelWidth;
                panelMaxHeight = Math.max(panelHeight, panelMaxHeight);
            }
            currentY += panelMaxHeight;
        }

        return result;
    }

    makePanelWidth(calculateWidth, column) {
        const result = column["w"];
        if (result) {
            return result;
        }
        return calculateWidth;
    }

    makePanelY(currentY, column) {
        const result = column["y"];
        if (result) {
            return result;
        }
        return currentY;
    }

    makePanelX(currentX, column) {
        const result = column["x"];
        if (result) {
            return result;
        }
        return currentX;
    }

    makePanelHeight(builder, column) {
        const result = column["h"];
        if (result) {
            return result;
        }
        return builder.height();
    }

    updatePanel(panel, column, id, x, y, panelWidth, panelHeight) {
        panel["gridPos"] = {
            "h": panelHeight,
            "w": panelWidth,
            "x": x,
            "y": y
        };
        panel["id"] = id;
        panel["title"] = column["title"];
    }

    loadJSON(path) {
        return JSON.parse(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }));
    }

    writeJSON(path, data) {
        fs.writeFileSync(path, JSON.stringify(data, null, 4));
    }
}

module.exports = DashboardBuilder;