var xValue = [];
var yValue = [];

var dataFound = true;

try {
    var xValue = data.series[0].fields[0].values;
    var yValue = data.series[0].fields[1].values;
}
catch (e) {
    dataFound = false
}

var trace1 = {};

if (dataFound) {
    trace1 = {
        x: xValue,
        y: yValue,
        type: 'bar',
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }
    };

    trace1.marker.color = trace1.x.map(function (v) {
        if (v <= 2500) {
            return '#0cce6a'
        }

        if (v > 2500 && v <= 4000) {
            return '#ffa400'
        }

        return '#ff4e43'
    });
}

var layout = {
    title: ''
}

if (!dataFound) {
    // Idea from: https://community.plotly.com/t/replacing-an-empty-graph-with-a-message/31497/2
    layout['annotations'] = [
        {
            "text": "No data",
            "xref": "paper",
            "yref": "paper",
            "showarrow": false,
            "font": {
                "size": 28
            }
        }
    ];

    layout['xaxis'] = {
        "visible": false
    };

    layout['yaxis'] = {
        "visible": false
    };
}

return { data: [trace1], layout: layout };