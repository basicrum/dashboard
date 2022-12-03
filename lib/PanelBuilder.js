// Includes
const fs = require('fs');

class PanelBuilder {
    
    constructor() {}

    static validate(panelPath) {

    }

    build(panelPath) {
        let attrs = {
            "options": {},
            "targets": {}
        };

        const path = panelPath.replace(/\/$/, '');

        // Read the panel components
        const panelQuery = fs.readFileSync(path + '/query.sql', {encoding:'utf8', flag:'r'});
        const panelLayout = fs.readFileSync(path + '/layout.json', {encoding:'utf8', flag:'r'});
        const panelScript = fs.readFileSync(path + '/script.js', {encoding:'utf8', flag:'r'});
        const panelOnClick = fs.readFileSync(path + '/on-click.js', {encoding:'utf8', flag:'r'});

        // Viz
        attrs["options"]["layout"] = JSON.parse(panelLayout);
        attrs["options"]["script"] = panelScript;
        attrs["options"]["onclick"] = panelOnClick;
        
        // Data
        attrs["targets"]["database"] = "default"; // TODO: Make dynamic
        attrs["targets"]["table"] = "webperf_rum_events"; // TODO: Make dynamic
        attrs["targets"]["query"] = panelQuery;

        return attrs;
    }
}

module.exports = PanelBuilder;