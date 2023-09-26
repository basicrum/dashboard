const DashboardBuilder = require('./lib/DashboardBuilder');
const builder = new DashboardBuilder()

const dashboards = ['General'];
for (const dashboard of dashboards) {
    builder.build(dashboard);
}
