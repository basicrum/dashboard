const fs = require('fs');
const DashboardBuilder = require('./lib/DashboardBuilder');
const builder = new DashboardBuilder()

function runTest(dashboard) {
    const options = {
        table: "basicrum_friends_webperf_rum_events",
        datasourceUid: "A0Wl5Mc4z",
        filterMap: {
            "hosts":"testHosts",
        },
    }
    
    builder.build(dashboard, options);

    const expected = JSON.parse(fs.readFileSync(`./testdata/dashboards/${dashboard}.json`, { encoding: 'utf8', flag: 'r' }));
    const actual = JSON.parse(fs.readFileSync(`./build/dashboards/${dashboard}.json`, { encoding: 'utf8', flag: 'r' }));
    expect(actual).toMatchObject(expected);
}

test('build General dashboard should be as expected', () => {
    runTest('General')
});

test('build Metrics dashboard should be as expected', () => {
    runTest('Metrics')
});
