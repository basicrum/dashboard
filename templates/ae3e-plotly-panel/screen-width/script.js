console.log(data);

var xValue = data.series[0].fields[0].values.buffer;

var yValue = data.series[0].fields[1].values.buffer;

var trace1 = {
    x: xValue,
    y: yValue,
    type: "bar",
    textposition: "auto",
    hoverinfo: "none",
    marker: {
        opacity: 0.6,
        line: {
            color: "rgb(8,48,107)",
            width: 1.5,
        },
    },
};

return { data: [trace1], layout: { title: "" } };
