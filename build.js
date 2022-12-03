// Includes
const fs = require('fs');
const PanelBuilder = require('./lib/PanelBuilder');
const DashboardBuilder = require('./lib/DashboardBuilder');

const pBuilder = new PanelBuilder();
const dBuilder = new DashboardBuilder()

const dashboardBasePath = __dirname + '/dashboards/defs/General.json';
const dashboardBase = __dirname + '/templates/dashboards/General.base.json';
const rowElementPath = __dirname + '/templates/elements/row.json';
const plotlyPanelElementPath = __dirname + '/templates/elements/plotly-panel.json';
const plotlyPanelsPath = __dirname + '/templates/ae3e-plotly-panel';

// Logic
let res = dBuilder.build(
    pBuilder,
    dashboardBasePath,
    rowElementPath,
    dashboardBase,
    plotlyPanelElementPath,
    plotlyPanelsPath
);

fs.writeFileSync('./build/dashboards/General.json', JSON.stringify(res, null, 4));