var bouncedBuckets = {};
var allBuckets = {};
var bounceRates = {};

var step = 500;
var current = 0;

while (current < 10000) {
    bouncedBuckets[current] = 0;
    allBuckets[current] = 0;
    bounceRates[current] = 0;
    current += step;
}


var xBouncedValue = data.series[0].fields[0].values.buffer;
var yBouncedValue = data.series[0].fields[1].values.buffer;

var xAllValue = data.series[1].fields[0].values.buffer;
var yAllValue = data.series[1].fields[1].values.buffer;

// Fill the bounces
for (var i = 0; i < xBouncedValue.length; i++) {
    bouncedBuckets[xBouncedValue[i]] = yBouncedValue[i];
}

// Fill all
for (var i = 0; i < xAllValue.length; i++) {
    allBuckets[xAllValue[i]] = yAllValue[i];
}

// Fill bounce rates
for (var currentBucket in bounceRates) {
    var currentBounces = bouncedBuckets[currentBucket];
    var currentAll = allBuckets[currentBucket];

    if (currentBounces > 0 && currentAll > 0) {
        bounceRates[currentBucket] = (currentBounces / currentAll) * 100;
    }
}

var trace1 = {
    x: Object.keys(bounceRates),
    y: Object.values(bounceRates),
    type: 'scatter'
};

var trace2 = {
    x: Object.keys(bouncedBuckets),
    y: Object.values(bouncedBuckets),
    type: 'scatter'
};

return { data: [trace1, trace2], layout: {title:''} };