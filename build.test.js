const fs = require("fs");
const DashboardBuilder = require("./src/lib/DashboardBuilder");
const builder = new DashboardBuilder()

function getDashboard(dashboard) {
    const options = {
        table: "basicrum_friends_webperf_rum_events",
        datasourceUid: "A0Wl5Mc4z",
        filterMap: {},
    }

    builder.build(dashboard, options);

    return JSON.parse(fs.readFileSync(`./build/dashboards/${dashboard}.json`, { encoding: "utf8", flag: "r" }));    
}

test("Test General dashboard should be as expected", () => {
    const generalDashboard = getDashboard("General");

    expect(34).toBe(generalDashboard.panels.length);
});

test("Test Metrics dashboard should be as expected", () => {
    const metricsDashboard = getDashboard("Metrics");

    expect(4).toBe(metricsDashboard.panels.length);
});

test("Test Summary dashboard should be as expected", () => {
    const summaryDashboard = getDashboard("Summary");

    expect(14).toBe(summaryDashboard.panels.length);
});
