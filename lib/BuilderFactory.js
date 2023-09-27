const RowBuilder = require("./RowBuilder");
const PanelBuilder = require("./PanelBuilder");

class BuilderFactory {
    constructor() {}

    create(columnType) {
        switch (columnType) {
            case "row":
                return new RowBuilder();
        }
        if (PanelBuilder.support(columnType)) {
            return new PanelBuilder(columnType);
        }
        throw new Error("unsupported column type[" + columnType + "]");
    }
}

module.exports = BuilderFactory;
