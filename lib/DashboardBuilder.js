// Includes
const fs = require('fs');
const BuilderFactory = require('./BuilderFactory');
const builderFactory = new BuilderFactory()

const rootPath = __dirname + '/..';
const dashboardTemplatePath = rootPath + '/templates/dashboards/General.base.json';

const maxWidth = 24;

class DashboardBuilder {
    
    constructor() {}

    build(dashboardName, options) {
        const result = this.loadJSON(dashboardTemplatePath);

        const dashboardDefinition = this.loadDashboardDefinition(dashboardName);
        this.addTitle(result, dashboardDefinition);
        this.addFilters(result, dashboardDefinition, options);
        this.addPanels(result, dashboardDefinition, options);

        this.writeDashboard(dashboardName, result);
    }
    
    loadDashboardDefinition(dashboardName) {
        return this.loadJSON(rootPath + `/dashboards/defs/${dashboardName}.json`);
    }

    writeDashboard(dashboardName, result) {
        this.writeJSON(`./build/dashboards/${dashboardName}.json`, result);
    }

    addTitle(result, dashboardDefinition) {
        result['title'] = dashboardDefinition["title"];
    }

    addFilters(result, dashboardDefinition, options) {
        result['templating']['list'] = this.buildFilters(dashboardDefinition["filters"], options);
    }

    addPanels(result, dashboardDefinition, options) {
        result["panels"] = this.buildPanels(dashboardDefinition["rows"], options);
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

    buildPanels(rows, options) {
        let result = [];

        let currentY = 0;
        let currentID = 1;
        for(const row of rows) {
            const panelWidth = maxWidth / row.length;
            let panelMaxHeight = 0;
            let currentX = 0;
            for(const column of row) {
                const columnType = column["type"];
                if (columnType == "none") {
                    continue
                }
                const builder = builderFactory.create(columnType);
                const panel = builder.build(column["source"], column["variables"] || {}, options);
                
                const panelHeight = builder.height();
                this.updatePanel(panel, column, currentID, currentX, currentY, panelWidth, panelHeight);
                
                result.push(panel);

                currentID++;
                currentX += panelWidth;
                panelMaxHeight = Math.max(panelHeight, panelMaxHeight);
            }
            currentY += panelMaxHeight;
        }

        return result;
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