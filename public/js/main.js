let globalChartRef;

window.addEventListener('DOMContentLoaded', function () {

    createGraph();

    document.getElementById('my_graph').onmousedown = function (result) {
        ourClickHandler(result);
    };

}, false);

function randomColor(alpha) {
    return String('rgba(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math
        .round(Math.random() * 255) + ',' + alpha + ')');
}

function ourClickHandler(element) {
    let scaleRef,
        valueX,
        valueY;
    console.log(globalChartRef.scales['xAxes'].min);
    for (var scaleKey in globalChartRef.scales) {
        scaleRef = globalChartRef.scales[scaleKey];
        console.log(scaleKey);
        if (scaleKey == 'xAxes') {
            valueX = scaleRef.getValueForPixel(element.offsetX);
            console.log('val x is', valueX);
        } else if (scaleKey == 'yAxes') {
            valueY = scaleRef.getValueForPixel(element.offsetY);
            console.log('val y is', valueY);
        }
    }

    if (valueX > globalChartRef.scales['xAxes'].min && 
        valueX < globalChartRef.scales['xAxes'].max && 
        valueY >globalChartRef.scales['yAxes'].min && 
        valueY < globalChartRef.scales['yAxes'].max) {
        // globalChartRef.data.datasets.forEach((dataset) => {
        //     dataset.data.push({
        //         x: valueX,
        //         y: valueY,
        //         extraInfo: 'info'
        //     });
        // });
        globalChartRef.data.datasets[0].data.push({'x': valueX, 'y': valueY});
        globalChartRef.update();
    }
}

function createGraph() {
    var config = {
        type: 'scatter',
        data: {
            datasets: [{
                label: "Dataset Made of Clicked Points",
                data: [],
                fill: true,
                showLine: false
            }]
        },
        options: {
            title: {
                display: true,
                text: "Chart.js Interactive Points"
            },
            scales: {
                xAxes: [{
                    type: "linear",
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'X-Axis'
                    },
                    ticks: {
                        min: -10,
                        suggestedMax: 5
                    }
                }, ],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Y-Axis'
                    },
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 15
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: true
        }
    };

    config.data.datasets.forEach(function (dataset) {
        dataset.borderColor = randomColor(0.8);
        dataset.backgroundColor = randomColor(0.7);
        dataset.pointBorderColor = randomColor(1);
        dataset.pointBackgroundColor = randomColor(1);
        dataset.pointRadius = 7;
        dataset.pointBorderWidth = 2;
        dataset.pointHoverRadius = 8;
    });

    var ctx = document.getElementById('my_graph').getContext('2d');
    globalChartRef = new Chart(ctx, config);
}