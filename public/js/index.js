var ctx = document.getElementById('my_graph').getContext('2d');
var randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
var my_graph = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
                type: 'scatter',
                label: "Data label 1",
                data: [],
                fill: false,
                backgroundColor: randomColor()
            }
            //         {
            //     data: [{'x': -20, 'y': 0}, {'x': 20, 'y': 0}],
            //     label: "axis",
            //     showLine: true,
            //     fill: false,
            //     borderWidth: 0.5,
            //     pointStyle: 'line',
            //     borderColor: '#000000'
            // },
            //         {
            //     data: [{'x': 0, 'y': -20}, {'x': 0, 'y': 20}],
            //     label: "axis",
            //     showLine: true,
            //     fill: false,
            //     borderWidth: 0.5,
            //     pointStyle: 'line',
            //     borderColor: '#000000'
            // }

        ]
    },
    options: {
        plugins: {
            legend: {
                display: true,
                labels: {
                     filter: function(legendItem, data) {
                            return data.datasets[legendItem.datasetIndex].label != 'axis'
                     }
                }
           }
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 20
        },
        scales: {
            x: {
                min: -20,
                max: 20,
                ticks: {
                    display: true
                },
            },
            y: {
                
                min: -20,
                max: 20,
                ticks: {
                    display: true
                },
            }
            // xAxes: [{
            //     type: "linear",
            //     display: true,
            //     scaleLabel: {
            //         display: true,
            //         labelString: 'X-Axis'
            //     }
            //     // ticks: {
            //     //     min: -20,
            //     //     suggestedMax: 20
            //     // }
            // } ],
            // yAxes: [{
            //     type: "linear",
            //     display: true,
            //     scaleLabel: {
            //         display: true,
            //         labelString: 'Y-Axis'
            //     }
            //     // ticks: {
            //     //     beginAtZero: true,
            //     //     suggestedMax: 20
            //     // }
            // }]
        }
    }
});


// x: {
//     min: 100,
//     max: 100
// },

// y: {
//     min: 100,
//     max: 100
// }

function parse_data() {
    const new_data = document.getElementById('input_data').value;
    let parsed_data = new_data.replace(/\(/g, "[").replace(/\)/g, "]");
    let data_points = JSON.parse("[" + parsed_data + "]");
    data_points.forEach(data_point => {
        let point = {
            'x': data_point[0],
            'y': data_point[1]
        };
        my_graph.data.datasets[0].data.push(point);
    });
    my_graph.options.scales.x.position = 'center';
    my_graph.options.scales.y.position = 'center';
    document.getElementById('input_data').value = "";
    my_graph.update();
};

function parse_kmeans_data() {
    const new_data = document.getElementById('input_data_kmeans').value;
    const desired_k = Number(document.getElementById('input_k').value);
    let parsed_data = new_data.replace(/\(/g, "[").replace(/\)/g, "]");
    let data_points = JSON.parse("[" + parsed_data + "]");

}

function parse_labled_data() {
    const new_labled_data = document.getElementById('labled_input_data').value;
    const new_lables = document.getElementById('input_lables').value;
    const lables = new_lables.split `,`.map(x => +x);
    let parsed_data = new_labled_data.replace(/\(/g, "[").replace(/\)/g, "]");
    let data_points = JSON.parse("[" + parsed_data + "]");
    labled_data_points = data_points.map(function (data, i) {
        return [data, lables[i]];
    });
    if (!my_graph.data.datasets[1]) {
        my_graph.data.datasets.push({
            type: 'scatter',
            label: "Data label 2",
            data: [],
            fill: false,
            backgroundColor: randomColor()
        });
    };
    labled_data_points.forEach(data_point => {
        let point = {
            'x': data_point[0][0],
            'y': data_point[0][1]
        };
        if (data_point[1] == 0) {
            my_graph.data.datasets[0].data.push(point);
        } else {
            my_graph.data.datasets[1].data.push(point);
        }
    });
    document.getElementById('labled_input_data').value = "";
    document.getElementById('input_lables').value = "";
    my_graph.update();
}


function clear_data() {
    my_graph.data.datasets.forEach(dataset => {
        if (dataset.label != 'axis') {
            dataset.data = [];
        };
    });
    my_graph.update();
};

function setting_switch() {
    let setting_boxes = document.querySelectorAll('.model_setting_box')
    let chosen_model = document.getElementById('model-selector');
    let i = 0;
    setting_boxes.forEach((setting_box) => {
        i++;
        if (chosen_model.value === String(i)) {
            setting_box.style.display = 'block';
        } else {
            setting_box.style.display = 'none';
        }
    });
    clear_data();
}


function edge_points() {
    // finds the most extreme points in dataset in order to align axes and length of line
    let x_vals = [];
    let y_vals = [];
    my_graph.data.datasets[0].data.forEach(point => {
        x_vals.push(point['x']);
        y_vals.push(point['y']);
    });
    min_x = Math.min(...x_vals)
    max_x = Math.max(...x_vals)
    min_y = Math.min(...y_vals)
    max_y = Math.min(...y_vals)
    left_bound = min_x >= 0 ? min_x -= 5*min_x : min_x += 5*min_x;
    right_bound = max_x >= 0 ? max_x += 5*max_x : max_x -= 5*max_x;
    // lower_bound = min_y >= 0 ? min_y -= 5*min_y : min_y += 5*min_y;
    // upper_bound = max_y >= 0 ? max_y += 5*max_y : max_y -= 5*max_y;
    // console.log(left_bound, right_bound, upper_bound, lower_bound);
    // HANDLE 0'S
    // return [
    //     {'x':min_x, 'y':min_y},
    //     {'x':max_x, 'y':max_y}
    // ];
    return [left_bound, right_bound]
};


function solve_linear_regression() {
    // send POST request to api that runs python script
    const data = my_graph.data.datasets[0].data;
    console.log(data);
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api', options)
    // fetch returning data from python script
    console.log('im at request');
    fetch('/python').then((response) => {
            console.log('resolved');
            return response.json();
        }).then((data) => {
            let slope = data["slope"];
            let bias = data["bias"];
            // need to graph y = x*slope + bias
            // find min and max points in curr dataset
            let point = (a, b, x) => {
                return a*x + b;
            };
            let bounds = edge_points();
            console.log('bounds is', bounds);
            // let lin_reg_data = [];
            // for (let i = bounds[0]; i < bounds[1]; i += 1) {
            //     lin_reg_data.push({'x': i, 'y':point(slope, bias, i)});
            // }
            let lin_reg_data = [{'x': bounds[0], 'y':point(slope, bias, bounds[0])}, {'x': bounds[1], 'y':point(slope, bias, bounds[1])}]
            console.log('line data is', lin_reg_data);
            my_graph.data.datasets.push({
                label: `y = ${slope}x + ${bias}`,
                data: lin_reg_data,
                showLine: true,
                fill: false,
                pointStyle: 'line',
                borderColor: randomColor()
                });
            
            my_graph.update();    
        })
        .catch((err) => {
            console.log('rejected', err);
        })
}

