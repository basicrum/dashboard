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

var summaryList = [];
for (const dashboard of dashboards) {
    var summary = builder.build(dashboard, options);
    summaryList.push(summary);
}

console.log("");
console.log("SUMMARY");
console.log("");
console.log("dashboards: " + summaryList.length);
console.log("");
for (const summary of summaryList) {
    console.log("dashboard: " + summary.name);
    console.log("panels: " + summary.panels);
    console.log("path: " + summary.path);
    console.log("");
}
