var fs = require('fs');

const DashboardBuilder = require('./lib/DashboardBuilder');
const builder = new DashboardBuilder()

const options = {
    table: "webperf_rum_events",
    datasourceUid: "BRUMMUCSTARBUCS",
    filterMap: {},
}

var dir = './build';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

dir = './build/dashboards';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const dashboards = ['General', 'Metrics', 'Summary'];

for (const dashboard of dashboards) {
    builder.build(dashboard, options);
}
