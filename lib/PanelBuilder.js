// Includes
const fs = require('fs');

const rootPath = __dirname + '/..';
const panelTemplatePath = rootPath + '/templates/elements/plotly-panel.json';
const plugin = "ae3e-plotly-panel";
const pluginTemplateDir  = rootPath + '/templates/' + plugin;

class PanelBuilder {
    
    constructor() {}

    height() {
        return 8
    }

    build(source) {
        const sourceTemplateDir = this.makeSourceTemplateDir(source);

        let result = this.loadJSON(panelTemplatePath);

        this.updatePlugin(result);
        this.updateVisualOptions(result, sourceTemplateDir);
        this.updateDataSource(result, sourceTemplateDir);

        return result;
    }

    updatePlugin(result) {
        result["plugin"] = plugin;
    }

    updateVisualOptions(result, sourceTemplateDir) {
        const options = result["options"];
        options["layout"] = this.loadJSON(sourceTemplateDir + '/layout.json');
        options["script"] = this.loadFile(sourceTemplateDir + '/script.js');
        options["onclick"] = this.loadFile(sourceTemplateDir + '/on-click.js');
    }

    updateDataSource(result, sourceTemplateDir) {
        let targets = result["targets"][0];
        targets["database"] = "default"; // TODO: Make dynamic
        targets["table"] = "webperf_rum_events"; // TODO: Make dynamic
        targets["query"] = this.loadFile(sourceTemplateDir + '/query.sql');
    }

    makeSourceTemplateDir(source) {
        return pluginTemplateDir + '/' + this.sanitizeSource(source);
    }

    sanitizeSource(source) {
        return source.replace(/\/$/, '');
    }

    loadJSON(path) {
        return JSON.parse(this.loadFile(path));
    }

    loadFile(path) {
        return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
    }

}

module.exports = PanelBuilder;