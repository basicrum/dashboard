// Includes
const fs = require('fs');
const merge = require('deepmerge');

const rootPath = __dirname + '/..';

const panelMap = {
    "ae3e-plotly-panel": true,
    "landing-ae3e-plotly-panel": true,
    "barchart": true,
    "timeseries-metric": true,
    "timeseries-visits": true,
    "bouncerate": true,
    "table": true,
    "geomap": true,
}

class PanelBuilder {

    static support(typeName) {
        return panelMap[typeName]
    }
    
    constructor(typeName) {
        this.panelTemplatePath = rootPath + '/templates/elements/' + typeName + '.json';
        this.typeTemplateDir  = rootPath + '/templates/' + typeName;
        this.defaultSourceDir  = rootPath + '/templates/' + typeName + '/default';
    }

    height() {
        return 8
    }

    build(source, variables, options) {
        const sourceTemplateDir = this.makeSourceTemplateDir(source);

        let result = this.buildElement(sourceTemplateDir);

        this.updateVisualOptions(result, sourceTemplateDir, variables);
        this.updateDataSource(result, sourceTemplateDir, variables, options);

        return result;
    }

    updateVisualOptions(result, sourceTemplateDir, variables) {
        const options = result["options"];
        options["layout"] = this.buildLayout(sourceTemplateDir);
        options["script"] = this.buildScript(sourceTemplateDir, variables);
        options["onclick"] = this.loadSourceFile(sourceTemplateDir, 'on-click.js');
    }

    buildScript(sourceTemplateDir, variables) {
        const scriptTemplate = this.loadSourceFile(sourceTemplateDir, "script.js");
        return this.replaceVariables(scriptTemplate, variables);
    }

    buildElement(sourceTemplateDir) {
        const element = this.loadJSON(this.panelTemplatePath);
        const elementMerge = this.loadElementMerge(sourceTemplateDir);
        return merge(element, elementMerge);
    }

    loadElementMerge(sourceTemplateDir) {
        const file = this.buildFilePath(sourceTemplateDir, 'element.merge.json');
        const result = this.loadJSONIfExist(file);
        if (!this.isEmptyObject(result)) {
            return result;
        }
        return this.loadJSONIfExist(this.buildFilePath(this.defaultSourceDir, 'element.merge.json'));
    }

    isEmptyObject(obj) {
        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                // object is not empty
                return false;
            }
        }
        return true;
    }

    buildLayout(sourceTemplateDir) {
        const layout = this.loadSourceJSON(sourceTemplateDir, 'layout.json');
        const layoutMerge = this.loadLayoutMerge(sourceTemplateDir);
        return merge(layout, layoutMerge);
    }

    loadLayoutMerge(sourceTemplateDir) {
        const layoutMergeFile = this.buildFilePath(sourceTemplateDir, 'layout.merge.json');
        return this.loadJSONIfExist(layoutMergeFile);
    }

    loadJSONIfExist(sourceFile) {
        if (fs.existsSync(sourceFile)) {
            return this.loadJSON(sourceFile);
        }
        return {};
    }

    loadSourceJSON(sourceTemplateDir, file) {
        const sourceFile = this.buildFilePath(sourceTemplateDir, file);
        if (fs.existsSync(sourceFile)) {
            return this.loadJSON(sourceFile);
        }
        return this.loadJSON(this.buildFilePath(this.defaultSourceDir, file));
    }

    loadSourceFile(sourceTemplateDir, file) {
        const sourceFile = this.buildFilePath(sourceTemplateDir, file);
        if (fs.existsSync(sourceFile)) {
            return this.loadFile(sourceFile);
        }
        return this.loadFile(this.buildFilePath(this.defaultSourceDir, file));
    }

    buildFilePath(dir, file) {
        return `${dir}/${file}`;
    }

    updateDataSource(result, sourceTemplateDir, variables, options) {
        result["datasource"]["uid"] = options["datasourceUid"];
        const targets = result["targets"];
        this.replaceTarget(sourceTemplateDir, variables, options, targets[0], "query");
        if (targets.length > 1) {
            this.replaceTarget(sourceTemplateDir, variables, options, targets[1], "query2");
        }
    }
    
    replaceTarget(sourceTemplateDir, variables, options, target, queryName) {
        target["database"] = "default"; // TODO: Make dynamic
        target["table"] = options["table"];
        target["datasource"]["uid"] = options["datasourceUid"];
        let queryTemplate = this.loadSourceFile(sourceTemplateDir, `${queryName}.sql`);
        target["query"] = this.replaceVariables(queryTemplate, variables);
    }

    replaceVariables(template, variables) {
        let result = template;
        for(const key in variables) {
            const value = variables[key];
            result = result.replaceAll("$$" + key, value)
        }
        return result;
    }

    makeSourceTemplateDir(source) {
        return this.typeTemplateDir + '/' + this.sanitizeSource(source);
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