const RowBuilder = require('./RowBuilder');
const PanelBuilder = require('./PanelBuilder');

class BuilderFactory {
    
    constructor() {}

    create(columnType) {
        switch(columnType) { 
            case 'row':
                return new RowBuilder()
            case 'panel':
                return new PanelBuilder()
        }
        throw new Error('unsupported column type[' + columnType + ']');
    }
}

module.exports = BuilderFactory;