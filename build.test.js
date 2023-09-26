const fs = require('fs');

test('build General dashboard should be as expected', () => {
    const expected = JSON.parse(fs.readFileSync('./testdata/dashboards/General.json', { encoding: 'utf8', flag: 'r' }));
    const actual = JSON.parse(fs.readFileSync('./build/dashboards/General.json', { encoding: 'utf8', flag: 'r' }));
    expect(actual).toMatchObject(expected);
});