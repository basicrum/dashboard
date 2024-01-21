// Includes
const fs = require('fs');

const rootPath = __dirname + '/../..';
const rowTemplatePath = rootPath + '/templates/elements/row.json';

class RowPanelBuilder {
    
    constructor() {}

    height() {
        return 1
    }

    build() {
        return this.loadJSON(rowTemplatePath);
    }

    loadJSON(path) {
        return JSON.parse(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }));
    }
}

module.exports = RowPanelBuilder;