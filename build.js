const DashboardBuilder = require('./lib/DashboardBuilder');
const builder = new DashboardBuilder()

const options = {
    table: "webperf_rum_events",
    datasourceUid: "BRUMMUCSTARBUCS",
    filterMap: {},
}

const dashboards = ['General', 'Metrics', 'Summary', 'Hostnames'];
for (const dashboard of dashboards) {
    builder.build(dashboard, options);
}
