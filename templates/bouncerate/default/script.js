var dataFound = true;

var layout = {
    title: ''
}

var trace1 = {};
var trace2 = {};

if (!data.series[0]) {
    dataFound = false;
}

if (dataFound) {
    var xBouncedValue = data.series[0].fields[0].values.buffer;
    var yBouncedValue = data.series[0].fields[1].values.buffer;

    var xAllValue = data.series[0].fields[0].values.buffer;
    var yAllValue = data.series[0].fields[2].values.buffer;

    // Start: Round bounce rate
    yBouncedValue = yBouncedValue.map(function(val){
        return val.toFixed(2);
    });
    // End: Round bounce rate

    // Start: calculate min and max of bounce rate in first 5 sec.
    var minBounceRate = 999;
    var maxBounceRate = 0;

    var step = xBouncedValue[1];
    var limit = 0;

    for (var cnt = 0; limit <= 5000; cnt++) {
        limit = limit + step;
        var val = parseInt(yBouncedValue[cnt]);

        if (val > maxBounceRate) {
            maxBounceRate = val;
        }

        if (val < minBounceRate) {
            minBounceRate = val;
        }
    }
    // End: calculate min and max of bounce rate in first 5 sec

    // Start: calculate range
    var rangeDistance = 10;
    var bottomBoundary = 0;
    var upperBoundary = 100;

    if (rangeDistance - minBounceRate > bottomBoundary) {
        bottomBoundary = minBounceRate | 0;
    }

    if (maxBounceRate + rangeDistance < upperBoundary) {
        upperBoundary = (maxBounceRate | 0) + rangeDistance;
    }

    upperBoundary = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce(function(prev, curr) {
        return (Math.abs(curr - upperBoundary) < Math.abs(prev - upperBoundary) ? curr : prev);
    });

    bottomBoundary = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reverse().reduce(function(prev, curr) {
        return (Math.abs(curr - bottomBoundary) < Math.abs(prev - bottomBoundary) ? curr : prev);
    });

    if (bottomBoundary == 10) {
        bottomBoundary = 0;
    }
    // End: calculate range

    // Start: Add annotations
    //  - Iterate yAllValue values
    //  - Add annotation on every 5th value

    var annotations = [];

    var i = 0;
    while (true) {
        var x = xBouncedValue[i];

        if (i % 5 == 0) {
            var y = yBouncedValue[i];
            var annotationText = y + "%";

            annotations.push({
                "xref": "x",
                "yref": "y2",
                "x": x,
                "y": y,
                "xanchor": "center",
                "yanchor": "bottom",
                "text": annotationText,
                "showarrow": false,
                "font": {
                    "family": "Arial",
                    "size": 12,
                    "color": "white"
                }
            });
        }

        i++;

        if (x > 5000) {
            break;
        }
    }

    // End: Add annotations

    var trace1 = {
        x: xBouncedValue,
        y: yBouncedValue,
        type: 'scatter',
        name: 'Bounce Rate',
        yaxis: "y2",
        line: {
            color: 'rgb(219, 64, 82)',
            width: 3
        }
    };

    var trace2 = {
        x: xAllValue,
        y: yAllValue,
        type: 'scatter',
        name: "Metric - Landing page",
        yaxis: "y1",
        line: {
            color:'rgb(55, 128, 191)',
            width: 3
        }
    };

    var layout = {
        title:'',
        xaxis: {
            fixedrange: true
        },
        yaxis: {
            fixedrange: true
        },
        xaxis2: {
            fixedrange: true
        },
        yaxis2: {
            overlaying: "y",
            side: "right",
            showgrid: false,
            tickvals: [
                0,
                10,
                20,
                30,
                40,
                50,
                60,
                70,
                80,
                90,
                100
            ],
            ticktext: [
                "10 %",
                "20 %",
                "30 %",
                "40 %",
                "50 %",
                "60 %",
                "70 %",
                "80 %",
                "90 %",
                "100 %"
            ],
            range: [
                bottomBoundary,
                upperBoundary
            ],
            fixedrange: true,
        }
    };

    if (annotations.length > 0) {
        layout["annotations"] = annotations;
    }
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

return { data: [trace1, trace2], layout: layout };