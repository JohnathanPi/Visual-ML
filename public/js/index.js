var ctx = document.getElementById('my_graph').getContext('2d');
let colors = ['#70d6ff', '#e76f51', '#dc2f02', '#f48c06', '#83c5be', '#a0c4ff', '#2ec4b6', '#e5989b', '#ffc8dd', '#c77dff',
'#560bad', '#f72585', '#b7e4c7', '#d9ed92', '#34a0a4', '#9d4edd', '#56cfe1', '#b5179e', '#72efdd', '#ffb700'];

let randomColor = () => colors[Math.floor(Math.random() * colors.length)];
let max_val = 20;


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
        }
    }
});

function extract_data(user_data_string) {
    // CONSIDER ADDING SQUARED BRACKETS SINCE NUMPY ARRAYS
    const coords = /\((\-?\d+\,\-?\d+)\)/g; // validate legal pairs of coordinates
    let preprocessed_data = user_data_string.replace(/ /g,"").replace(/\[|\]/g ,"")
    let validated_data = preprocessed_data.match(coords) || [];
    console.log(preprocessed_data.length === validated_data.length);
    if (validated_data.length === 0) {
        console.log('input error')
        document.getElementById('input_data').placeholder = 'Illegal Data !';
        return []; // Not sure this is ideal might cause problems later !
        // Need to decide what to do with partially correct data 
        // numbers starting with 0 known error
    }
    document.getElementById('input_data').placeholder = 'Enter Data:';
    validated_data = validated_data.toString().replace(/\(/g, "[").replace(/\)/g, "]");
    return validated_data;
}


function parse_data() {
    const new_data = document.getElementById('input_data').value;
    let parsed_data = extract_data(new_data);
    let data_points = JSON.parse("[" + parsed_data + "]");
    let x_vals = [];
    let y_vals = [];
    data_points.forEach(data_point => {
        x_vals.push(data_point[0]);
        y_vals.push(data_point[1]);
        let point = {
            'x': data_point[0],
            'y': data_point[1]
        };
        my_graph.data.datasets[0].data.push(point);
    });
    max_x = Math.max(...x_vals);
    max_y = Math.max(...y_vals);
    max_val = max_x >= max_y ? max_x : max_y;
    my_graph.options.scales.x.min = -max_val - 10;
    my_graph.options.scales.x.max = max_val + 10;
    my_graph.options.scales.y.min = -max_val - 10;
    my_graph.options.scales.y.max = max_val + 10;
    my_graph.options.scales.x.position = 'center';
    my_graph.options.scales.y.position = 'center';
    document.getElementById('input_data').value = "";
    my_graph.update();
};

function parse_kmeans_data() {
    const new_data = document.getElementById('input_data_kmeans').value;
    let parsed_data = extract_data(new_data);
    let data_points = JSON.parse("[" + parsed_data + "]");
    let x_vals = [];
    let y_vals = [];
    data_points.forEach(data_point => {
        x_vals.push(data_point[0]);
        y_vals.push(data_point[1]);
        let point = {
            'x': data_point[0],
            'y': data_point[1]
        };
        my_graph.data.datasets[0].data.push(point);
    });
    max_x = Math.max(...x_vals);
    max_y = Math.max(...y_vals);
    max_val = max_x >= max_y ? max_x : max_y;
    my_graph.options.scales.x.min = -max_val - 10;
    my_graph.options.scales.x.max = max_val + 10;
    my_graph.options.scales.y.min = -max_val - 10;
    my_graph.options.scales.y.max = max_val + 10;
    my_graph.options.scales.x.position = 'center';
    my_graph.options.scales.y.position = 'center';
    document.getElementById('input_data').value = "";
    my_graph.update();

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
    console.log(my_graph.data.datasets[0]);
    console.log(my_graph.data.datasets[1]);
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

let calc_func_y = (a, b, x) => {
    return a*x + b;
};

let calc_func_x = (a, b, y) => {
    return (y - b) / a;
};

function line_through_border(slope, bias, border) {
    // find the sides where the line intercepts the graphs border
    if (slope === 0) {
        console.log('slope 0')
        return [{'x': -border, 'y': bias}, {'x': border, 'y': bias}]
    }
    border_y_intercept_1 = {'x' : calc_func_x(slope, bias, border), 'y' : border} // top of border box
    border_y_intercept_2 = {'x' : calc_func_x(slope, bias, -border), 'y' : -border} // bottom of border box
    border_x_intercept_1 = {'x': border, 'y' : calc_func_y(slope, bias, border)} // right of border box
    border_x_intercept_2 = {'x': -border, 'y' : calc_func_y(slope, bias, -border)} // left of border box
    let intercepts = [border_y_intercept_1, border_y_intercept_2, border_x_intercept_1, border_x_intercept_2];
    let final_points = [];
    intercepts.forEach(point => {
        if ((-border <= point['x'] <= border) && (-border <= point['y'] <= border)) { // check if point is on the border
            final_points.push(point);
        };
    });
    console.log(final_points.slice(0,2))
    return final_points.slice(0, 2);
}

function solve_svm() {
    const data = {'1':my_graph.data.datasets[0].data, '-1':my_graph.data.datasets[1].data};
    console.log(data);
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api', options)
    fetch('/svm').then((response) => {
        return response.json();
    }).then((data) => {
        let slope = data["slope"];
        let bias = data["bias"];
        // need to graph y = x*slope + bias
        // find min and max points in curr dataset
        border_size = max_val >= 20 ? max_val : 20;
        // edge cases (slope = 0) 
        let seperating_plane = line_through_border(slope, bias, border_size + 10);
        my_graph.data.datasets.push({
            label: bias >= 0 ? `y = ${slope}x + ${bias}` : `y = ${slope}x - ${-1*bias}`, 
            data: seperating_plane,
            showLine: true,
            fill: false,
            pointStyle: 'line',
            borderColor: randomColor()
            });
        delete data.slope
        delete data.bias
        let sv_coords = [];
        Object.entries(data).forEach(point => {
            sv_coords.push({'x': point[1][0], 'y': point[1][1]});
            console.log(sv_coords);
        })
        my_graph.data.datasets.push({
            label: 'Support Vectors', 
            data: sv_coords,
            showLine: false,
            fill: false,
            pointStyle: 'cross',
            borderColor: '#000',
            radius: 10
            });
        my_graph.update();  

    })
}

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
            return response.json();
        }).then((data) => {
            if(data === 0) {
                // Need to show this directly to user !
                throw new Error("Cannot perform regression with infinite slope")
            } 
            let slope = data["slope"];
            let bias = data["bias"];
            let r_squared = data["R^2"]
            // need to graph y = x*slope + bias
            // find min and max points in curr dataset
            border_size = max_val >= 20 ? max_val : 20;
            // edge cases (slope = 0) 
            let lin_reg_data = line_through_border(slope, bias, border_size + 10);
            console.log('returned', lin_reg_data)
            my_graph.data.datasets.push({
                label: bias >= 0 ? `y = ${slope}x + ${bias} | R^2 = ${r_squared}` : `y = ${slope}x - ${-1*bias} | R^2 = ${r_squared}`, 
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

