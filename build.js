var fs = require("fs");

const DashboardBuilder = require("./lib/DashboardBuilder");
const { exit } = require("process");
const builder = new DashboardBuilder()

const options = {
    table: "webperf_rum_events",
    datasourceUid: "BRUMMUCSTARBUCS",
    filterMap: {},
}

const buildDir = "./build";

try {
    if(fs.existsSync(buildDir)) {
        fs.rmSync(buildDir, { recursive: true, force: true });
        console.log("Removed the build folder.");
    }
} catch(e) {
    console.error(e);
    exit(1);
}

if (!fs.existsSync(buildDir)){
    fs.mkdirSync(buildDir);
    console.log("Created build folder.");
}

const dashboardsDir = "./build/dashboards";
if (!fs.existsSync(dashboardsDir)){
    fs.mkdirSync(dashboardsDir);
    console.log("Created build/dashboards folder.");
}

const datasourcesDir = "./build/datasources";
if (!fs.existsSync(datasourcesDir)){
    fs.mkdirSync(datasourcesDir);
    console.log("Created build/datasources folder.");
}

try {
    fs.copyFileSync("./templates/dashboards/General.yaml", "./build/dashboards/General.yaml");
    console.log("Added build/dashboards/General.yaml");
} catch(e) {
    console.error(e);
    exit(1);
}

try {
    fs.copyFileSync("./templates/datasources/default.yaml", "./build/datasources/default.yaml");
    console.log("Added build/datasources/default.yaml");
} catch(e) {
    console.error(e);
    exit(1);
}

const dashboards = ["General", "Metrics", "Summary"];

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
