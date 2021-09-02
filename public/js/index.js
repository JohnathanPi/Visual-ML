var ctx = document.getElementById('my_graph').getContext('2d');
var my_graph = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
                type: 'scatter',
                label: "Data label 1",
                data: [],
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)'
            }

        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 20
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
        }
    }
});

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
            backgroundColor: '#48cae4'
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
        dataset.data = [];
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

function graph_test() {
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

}

let request = () => {
    console.log('im at request');
    fetch('/python').then((response) => {
            console.log('resolved');
            return response.json();
        }).then((data) => {
            // my_graph.data.datasets.push({
            //     label: 'Regression Line',
            //     data: data,
            //     showLine: true,
            //     fill: false,
            //     borderColor: '#DAEDBD'
            //     });
            // my_graph.update();
            let slope = data["slope"];
            let bias = data["bias"];
            // need to graph y = x*slope + bias
            // find min and max points in curr dataset
            lin_reg_data = my_graph.data.datasets[0].data;
            console.log(lin_reg_data);
            
        })
        .catch((err) => {
            console.log('rejected', err);
        })
}