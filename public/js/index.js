// MISC
////////////////////////////////////////////////////////////
let ctx = document.getElementById('my_graph').getContext('2d');

let my_graph = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: []
    },
    options: {
        plugins: {
            legend: {
                display: true,
                labels: {
                    filter: function (item, chart) {
                        return !item.text.includes('margin2') && !item.text.includes('test');


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

let colors = ['#020c64', '#09df8a', '#7400b8', '#f4845f', '#f3a338',
    '#bd2ea4', '#e08ab7', '#fa1b73', '#f7e27e',
    '#c0aeed', '#a11d33', '#0083e2', '#00a6fb'
];

let class_1_colors = ['#e08ab7', '#0083e2',
    '#bd2ea4', '#e5989b', '#2a9d8f', '#dda15e',
    '#56cfe1', '#52b788', '#95d5b2', '#00b4d8',
    '#b6ccfe'
]

// let class_1_colors = ['#34ace0', '#33d9b2'
// , '#ffb142', '#ffda79', '#cc8e35', '#0fbcf9',
// '#05c46b','#00d8d6','#ffb8b8']

// let class_2_colors = ['#40407a', '#706fd3', '#2c2c54', 
// , '#ff5252', '#F97F51', '#b33939', '#cd6133',
// '#ef5777','#575fcf','#f53b57','#485460',
// '#7158e2','#3d3d3d','#c56cf0','#cd84f1','#6D214F','#FD7272']


let class_2_colors = ['#6a4c93', '#e63946', '#2d00f7',
    '#00296b', '#f25c54', '#9e0059', '#005f73', '#344e41', '#1c2541',
    '#eb5e28', '#ff7b00', '#641220', '#386641', '#7d8597', '#004b23'
]



let decision_boundary_colors = ['#264653', '#023e8a', '#3a0ca3', '#6d6875', '#005f73',
    '#212529', '#495057', '#118ab2', '#34a0a4', '#ee6c4d', '#9a031e', '#3c096c', '#3c096c'
]

let class_colors = class_1_colors.concat(class_2_colors)

let all_colors = class_1_colors.concat(class_2_colors).concat(decision_boundary_colors);

let clear_button = document.getElementById('clear-button');


const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt,
        m = Math.round,
        a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length,
            x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        }
        return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? {
        r: 0,
        g: 0,
        b: 0,
        a: -1
    } : {
        r: 255,
        g: 255,
        b: 255,
        a: -1
    }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

let random_color = (colors) => {
    return colors[Math.floor(Math.random() * colors.length)]
};
let max_val = 20;

document.getElementById('my_graph').onmousedown = (event) => {
    on_click_handler(event);
}

// GRAPH RELATED FUNCS ///////////////////////
// ##########################################
function on_click_handler(click) {
    let chosen_model = document.getElementById('model-selector');
    let curr_model_id = chosen_model.options[chosen_model.selectedIndex].value;
    let curr_scale, x_val, y_val;
    let flag = click.button === 2 ? 'right_click' : 'left_click'
    if (flag === 'right_click' && ((curr_model_id === '1' || curr_model_id === '4'))) {
        show_error('This model only supports one class');
        return
    }
    if (flag === 'right_click' && my_graph.data.datasets.length === 0) {
        show_error('Please enter class 1 data using left click first')
        return
    }
    for (let scale in my_graph.scales) {
        curr_scale = my_graph.scales[scale];
        if (scale == 'x') {
            x_val = curr_scale.getValueForPixel(click.offsetX);
        } else if (scale == "y") {
            y_val = curr_scale.getValueForPixel(click.offsetY);
        }
    }
    if (!my_graph.data.datasets[0]) {
        add_datasets(my_graph, 0)
    }
    if (!my_graph.data.datasets[1] && flag === 'right_click') {
        add_datasets(my_graph, 1)
    }
    if (x_val > my_graph.scales['x'].min && // click within border
        x_val < my_graph.scales['x'].max &&
        y_val > my_graph.scales['y'].min &&
        y_val < my_graph.scales['y'].max) {
        if (flag === 'left_click') {
            my_graph.data.datasets[0].data.push({
                'x': Math.round(x_val),
                'y': Math.round(y_val)
            });
        } else if (flag === 'right_click') {
            my_graph.data.datasets[1].data.push({
                'x': Math.round(x_val),
                'y': Math.round(y_val)
            });

        }
    }
    my_graph.update();
    return;
}


function add_datasets(graph, expected_sets) {
    let num_of_datasets = graph.data.datasets.length;
    if (num_of_datasets === expected_sets) {
        if (num_of_datasets === 0) {
            graph.data.datasets.push({
                type: 'scatter',
                label: `Class ${expected_sets + 1}`,
                data: [],
                fill: false,
                backgroundColor: random_color(class_1_colors)
            })
        } else if (num_of_datasets === 1) {
            graph.data.datasets.push({
                type: 'scatter',
                label: `Class ${expected_sets + 1}`,
                data: [],
                fill: false,
                backgroundColor: random_color(class_2_colors)
            })
        } else {
            graph.data.datasets.push({
                type: 'scatter',
                label: `Class ${expected_sets + 1}`,
                data: [],
                fill: false,
                backgroundColor: random_color(all_colors)
            });
        }
        return true;
    }
    return;
}

function max_border_size(graph) {
    let border_vals = [graph.options.scales.x.min, graph.options.scales.x.max, graph.options.scales.y.min, graph.options.scales.y.max];
    return Math.max.apply(null, border_vals.map(Math.abs)); 
}

function scale_graph(graph, max_x, max_y) {
    if (max_x >= 1) {
        padding_x = max_x + Math.round(Math.log(max_x))
    }
    if (max_y >= 1) {
        padding_y = max_y + Math.round(Math.log(max_y))
    }
    if (max_x < 1) {
        padding_x = max_x + Math.round(-Math.log(max_x))
    }
    if (max_y < 1) {
        padding_y = max_y + Math.round(-Math.log(max_y))
    }
    graph.options.scales.x.min = -max_x - padding_x;
    graph.options.scales.x.max = max_x + padding_x;
    graph.options.scales.y.min = -max_y - padding_y;
    graph.options.scales.y.max = max_y + padding_y;
    return;
}

function perpendicular_line(value, axis, border) {
    if (axis === 1) {
        point_1 = {
            'x': -border,
            'y': value
        }
        point_2 = {
            'x': border,
            'y': value
        }
    } else if (axis === 0) {
        point_1 = {
            'x': value,
            'y': -border
        }
        point_2 = {
            'x': value,
            'y': border
        }
    }
    return [point_1, point_2]
}

function line_through_border(slope, bias, border) {
    // find the sides where the line intercepts the graphs border
    if (slope === 0) {
        return [{
            'x': -border,
            'y': bias
        }, {
            'x': border,
            'y': bias
        }]
    }
    border_y_intercept_1 = {
        'x': calc_func_x(slope, bias, border),
        'y': border
    } // top of border box
    border_y_intercept_2 = {
        'x': calc_func_x(slope, bias, -border),
        'y': -border
    } // bottom of border box
    border_x_intercept_1 = {
        'x': border,
        'y': calc_func_y(slope, bias, border)
    } // right of border box
    border_x_intercept_2 = {
        'x': -border,
        'y': calc_func_y(slope, bias, -border)
    } // left of border box
    let intercepts = [border_y_intercept_1, border_y_intercept_2, border_x_intercept_1, border_x_intercept_2];
    let final_points = [];
    intercepts.forEach(point => {
        if ((-border <= point['x'] <= border) && (-border <= point['y'] <= border)) { // check if point is on the border
            final_points.push(point);
        };
    });
    return final_points.slice(0, 2); // handles perfect diagonal edge case
}

// ####### DOM FUNCTIONS #########################
// ###############################################

function show_error(msg) {
    // general function to display errors to the user
    error = document.getElementById('error');
    error.textContent = msg;
    error.style.color = "red"
    setTimeout(() => {
        error.textContent = '';
    }, 1500);
}

function show_data_box() {
    let data_enter_div = document.getElementById("data_input_1");
    if (data_enter_div.style.display === 'none' || data_enter_div.style.display === '') {
        data_enter_div.style.display = 'flex';
    } else {
        data_enter_div.style.display = 'none';
    }
};

function check_readonly() {
    // checks the model and allows inputing labels if applicable
    // and changes the onclick function for the ADD button
    let label_input = document.getElementById('input_labels');
    let log_reg_div = document.getElementById('log_reg_div');
    let svm_div = document.getElementById('svm_div');
    let decision_tree_div = document.getElementById('decision_tree_div');
    let add_data_btn = document.getElementById('add_data_btn');
    if (log_reg_div.style.display === 'flex' ||
        svm_div.style.display === 'flex' ||
        decision_tree_div.style.display === 'flex') {
        label_input.readOnly = false;
        add_data_btn.onclick = parse_labled_data;
    } else {
        label_input.value = "";
        label_input.readOnly = true;
        add_data_btn.onclick = parse_data;
    }
}

function setting_switch() {
    // changes between the divs displaying model parameters
    // places correct solve button for each model and hides others
    let solve_buttons = document.querySelectorAll('.solve_btn')
    let chosen_model = document.getElementById('model-selector');
    let model_divs = document.querySelectorAll('.model_div')
    let model_div_cont = document.getElementById('model-div-cont')
    clear_button.style.display = 'none';
    let i = 0;
    solve_buttons.forEach((solve_button) => {
        i++;
        if (chosen_model.value === String(i)) {
            solve_button.style.display = 'block';
            if (i === 4) {
                model_div_cont.style.display = 'flex';
            } else {
                model_div_cont.style.display = 'none';
            }
        } else {
            solve_button.style.display = 'none';
        }
    });
    i = 0;
    model_divs.forEach((model_div) => {
        i++;
        if (chosen_model.value === String(i)) {
            model_div.style.display = 'flex';
        } else {
            model_div.style.display = 'none';
        }
    });
    check_readonly();
    clear_data();
}

let calc_func_y = (a, b, x) => {
    return a * x + b;
};

let calc_func_x = (a, b, y) => {
    return (y - b) / a;
};

function shuffle(array) {
    // shuffles array for non repeating colors in k-means
    let copy = array.slice();
    let final = [];
    let n = copy.length
    let i;
    while (n) {
        i = Math.floor(Math.random() * copy.length);
        if (i in copy) {
            final.push(copy[i]);
            delete copy[i];
            n--;
        }
    }
    return final;
}


//////////////////////////////////////////
// DATA HANDLING ////////////////////////
/////////////////////////////////////////
function extract_data(user_data_string) {
    // function that recieves a string that should represent data and transofrm it to readable data
    //const coords = /(\(|\[)(\ *?\-?(\d*\.?\d*)(\,?|(\, *)|\ *?)\-?(\d*\.?\d*))( *)(\)|\])/g
    // handles numpy array entry, changes spaces between numbers only to commas
    const replace_spaces_with_commas = new RegExp(/(?<=\[\ *?\-?\(\d+|([+-]?([0-9]*[.])?[0-9]+\.?\ *))( +?)(?=\ *\-?\(\d+|([+-]?([0-9]*[.])?[0-9]+\.?\ *)\])/g)
    // checks for illegal charecters in entered data
    const find_illegal_chars = new RegExp(/([A-Z]|[a-z]|[\!-\']|[\*\+\`]|[\:\;\?\@\^\_\~])+/g)
    //let preprocessed_data = user_data_string.replace(/\[/g, "(").replace(/\]/g, ")")
    let preprocessed_data = user_data_string.replace(replace_spaces_with_commas, ",").replace(/ /g, "").replace(/\[/g, "(").replace(/\]/g, ")")
    if (preprocessed_data.match(find_illegal_chars)) {
        show_error('Cannot enter letters as data!')
        return false;
    }
    let validated_data = preprocessed_data || [];
    document.getElementById('input_data').placeholder = 'Enter Data:';
    validated_data = validated_data.toString().replace(/\(/g, "[").replace(/\)/g, "]").replace(/( +|\t+|[\r\n]+)/g, "").
    replace(/\]\[/g, "],[").replace("[[", "[").replace("]]", "]");
    return validated_data;
}

function format_data(unformatted_data) {
    // recieves the string from extract data and turns it into legal data
    let parsed_data = extract_data(unformatted_data);
    if (parsed_data === false) return false;
    let trailing_decimal = new RegExp(/\d\.(?!\d)/g) // finds numbers of the type 3., 1. etc...
    do {
        temp = trailing_decimal.exec(parsed_data); // matches them in string
        if (temp) {
            // generate new regex according to the problematic number and replace with legal one
            let temp_regex = new RegExp('[' + parseInt(temp[0]).toString() + '\\.]\\.(?!\\d)', "g")
            parsed_data = parsed_data.replace(temp_regex, parseInt(temp[0]).toString())
        }
    } while (temp);
    try {
        let formatted_data = JSON.parse("[" + parsed_data + "]"); // turn legal data string into usable data
        return formatted_data;
    } catch {
        show_error("Data parsing failed !");
        return;
    }
}



function parse_data() {
    // function that handles recieving the input data from the user and pushing it to the chart object
    const new_data = document.getElementById('input_data').value;
    data_points = format_data(new_data)
    if (data_points === false) {
        return;
    }
    let x_vals = [];
    let y_vals = [];
    let point_array = Object.values(data_points)
    for (let i = 0; i < point_array.length; i++) {
        let data_point = point_array[i];
        if (data_point[0] === undefined || data_point[1] === undefined) {
            // catches 1D data
            show_error("Entered 1-D data point");
            return;
        }
        x_vals.push(data_point[0]);
        y_vals.push(data_point[1]);
        let point = {
            'x': data_point[0],
            'y': data_point[1]
        };
        add_datasets(my_graph, 0);
        my_graph.data.datasets[0].data.push(point);
    };
    max_x = Math.max.apply(null, x_vals.map(Math.abs)); // finds maximal x by absolute value
    max_y = Math.max.apply(null, y_vals.map(Math.abs)); // finds maximal y by absolute value
    max_val = max_x >= max_y ? max_x : max_y;
    scale_graph(my_graph, max_x, max_y) // scales the graph according to the maximal value so that all data will be visible
    my_graph.options.scales.x.position = 'center'; // add x axis
    my_graph.options.scales.y.position = 'center'; // add y axis
    document.getElementById('input_data').value = "";
    my_graph.update();
};


function parse_labled_data() {
    // parses and matches the data and lables entered by the user
    const coords = /\d/g // used for extracting lables 
    const new_labeld_data = document.getElementById('input_data').value;
    if (new_labeld_data === '') {
        show_error('Please enter data');
        return;
    }
    const new_labels = document.getElementById('input_labels').value;
    if (!new_labels) {
        show_error('Please enter lables');
        return;
    }
    let labels = new_labels.match(coords).map(x => +x); // turns string to int
    for (let i = 0; i < labels.length; i++) {
        if (labels[i] != 1 && labels[i] != 0) {
            show_error('Entered illegal label');
            return;
        }
    }
    let data_points = format_data(new_labeld_data)
    if (data_points === false) {
        return;
    }
    labled_data_points = data_points.map(function (data, i) {
        return [data, labels[i]];
    });
    x_vals = [];
    y_vals = [];
    add_datasets(my_graph, 0);
    add_datasets(my_graph, 1);
    labled_data_points.forEach(data_point => {
        x_vals.push(data_point[0][0]);
        y_vals.push(data_point[0][1]);
        let point = {
            'x': data_point[0][0],
            'y': data_point[0][1]
        };
        if (data_point[1] === 0) {
            my_graph.data.datasets[0].data.push(point);
        } else if (data_point[1] === 1) {
            my_graph.data.datasets[1].data.push(point);
        } else {
            show_error('Entered illegal class !');
        }
    });
    max_x = Math.max.apply(null, x_vals.map(Math.abs));
    max_y = Math.max.apply(null, y_vals.map(Math.abs));
    max_val = max_x >= max_y ? max_x : max_y;
    scale_graph(my_graph, max_x, max_y)
    my_graph.options.scales.x.position = 'center';
    my_graph.options.scales.y.position = 'center';
    document.getElementById('input_data').value = "";
    document.getElementById('input_labels').value = "";
    my_graph.update();
}


function clear_data(flag = 1) {
    // used to clear and rescale the graph after solving or changing model
    clear_button.style.display = 'none';
    my_graph.data.datasets = [];
    my_graph.options.scales.x.max = 20;
    my_graph.options.scales.x.min = -20;
    my_graph.options.scales.y.max = 20;
    my_graph.options.scales.y.min = -20;
    my_graph.update();
};

///////////////////////////////////////////////
// SERVERSIDE MODEL RUNNING //////////////////
//////////////////////////////////////////////
function solve_linear_regression() {
    // send POST request to api that runs python script
    if (!my_graph.data.datasets[0]) {
        show_error('Cannot perform linear regression with no data');
        return;
    }
    const data = my_graph.data.datasets[0].data;
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log('THE SENT DATA IS', JSON.stringify(data))
    async function send_and_solve_lin_reg() {
        await fetch('/api', options);
        console.log('finished awaiting');
        fetch('/lin_reg').then((response) => {
                console.log('THE RESPONSE IS', response)
                return response.json();
            }).then((data) => {
                console.log('THE DATA IS', data);
                if (data === 0) {
                    // solver script returns 0 if there is a single data point
                    show_error("Not enoguh data")
                    return
                }
                if (data === 1) {
                    // solver script returns 1 if the regression line has infinite slope
                    show_error("Cannot perform regression with infinite slope")
                    return
                }
                let slope = data["slope"];
                let bias = data["bias"];
                let r_squared = data["R^2"]
                let max_border = max_border_size(my_graph)
                border_size = max_border >= 20 ? max_border : 20; // adjusts border if needed
                let lin_reg_data = line_through_border(slope, bias, border_size + 10); // gets the two points between which to draw the line
                my_graph.data.datasets.push({ // pushes line to graph
                    label: bias >= 0 ? `y = ${slope}x + ${bias} | R^2 = ${r_squared}` : `y = ${slope}x - ${-1*bias} | R^2 = ${r_squared}`,
                    data: lin_reg_data,
                    showLine: true,
                    fill: false,
                    pointStyle: 'line',
                    borderColor: random_color(decision_boundary_colors)
                });
                clear_button.style.display = "flex" // displays clear button
                my_graph.update();
            })
            .catch((err) => {
                console.log('rejected', err);
            })
    }
    send_and_solve_lin_reg();
}

function solve_logistic_regression() {
    if (!my_graph.data.datasets[0]) {
        show_error('Cannot perform logistic regression with no data');
        return;
    }
    if (!my_graph.data.datasets[1]) {
        show_error('Cannot perform logistic regression with one class');
        return
    }
    const data = {
        '1': my_graph.data.datasets[0].data,
        '0': my_graph.data.datasets[1].data
    };
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log('THE SENT DATA IS', JSON.stringify(data))
    async function send_and_solve_log_reg() {
        await fetch('/api', options);
        console.log('finished awaiting');
        fetch('/log_reg').then((response) => {
            console.log('THE RESPONSE IS', response)
            return response.json();
        }).then((data) => {
            console.log('The data is', data)
            if (data['flag'] === 1) {
                // infinite slope edge case
                my_graph.data.datasets.push({
                    label: 'test',
                    data: perpendicular_line(data['slope'], 0, 20),
                    showLine: true,
                    fill: false,
                    pointStyle: 'line',
                    borderColor: random_color(decision_boundary_colors)
                });
                my_graph.update();
                return
            }
            if (data === 1) {
                show_error('Cannot perform logistic regression with one class')
                return
            } else {
                let slope = data["slope"];
                let bias = data["bias"];
                let acc = data["accuracy"]
                let max_border = max_border_size(my_graph)
                border_size = max_border >= 20 ? max_border : 20;
                let seperating_plane = line_through_border(slope, bias, border_size + 10);
                my_graph.data.datasets.push({
                    label: bias >= 0 ? `y = ${slope}x + ${bias} | accuracy = ${acc}` : `y = ${slope}x - ${-1*bias} | accuracy = ${acc}`,
                    data: seperating_plane,
                    showLine: true,
                    fill: false,
                    pointStyle: 'line',
                    borderColor: random_color(decision_boundary_colors)
                });
                clear_button.style.display = "flex" // displays clear button
                my_graph.update();
            }
        })

    }
    send_and_solve_log_reg();
}


function solve_svm() {
    if (!my_graph.data.datasets[0]) {
        show_error('Cannot perform svm with no data');
        return;
    }
    if (!my_graph.data.datasets[1]) {
        show_error('Cannot perform svm with one class');
        return
    }
    const data = {
        '1': my_graph.data.datasets[0].data,
        '-1': my_graph.data.datasets[1].data
    };
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log('THE SENT DATA IS', JSON.stringify(data))
    async function send_and_solve_SVM() {
        await fetch('/api', options);
        console.log('finished awaiting');
        fetch('/svm').then((response) => {
            console.log('THE RESPONSE IS', response)
            return response.json();
        }).then((data) => {
            console.log('The data is', data)
            if (data === 0) {
                show_error('An unknown error occured');
            }
            if (data["flag"]) {
                // infinite slope edge case
                my_graph.data.datasets.push({
                    label: `x = ${data['slope']}`,
                    data: perpendicular_line(data['slope'], 0, 20),
                    showLine: true,
                    fill: false,
                    pointStyle: 'line',
                    borderColor: random_color(decision_boundary_colors)
                });
                my_graph.data.datasets.push({
                    label: 'margin',
                    data: perpendicular_line(data['bias-1'], 0, 20),
                    showLine: true,
                    fill: false,
                    borderDash: [10, 10],
                    pointStyle: 'line',
                    borderWidth: 1,
                    borderColor: '#000'
                });
                my_graph.data.datasets.push({
                    label: 'margin2',
                    data: perpendicular_line(data['bias-2'], 0, 20),
                    showLine: true,
                    fill: false,
                    borderDash: [10, 10],
                    pointStyle: 'line',
                    borderWidth: 1,
                    borderColor: '#000'
                });
                // clear data to allow iteration of support vectors
                delete data.slope;
                delete data.bias;
                delete data.weight_norm;
                delete data.margin
                delete data.flag
                let sv_coords = [];
                Object.entries(data).forEach(point => {
                    sv_coords.push({
                        'x': point[1][0],
                        'y': point[1][1]
                    });
                })
                my_graph.data.datasets.push({
                    label: 'Support Vectors',
                    data: sv_coords,
                    showLine: false,
                    fill: false,
                    borderColor: '#000',
                    radius: 5
                });
                my_graph.update();
                return;
            }
            let slope = data["slope"];
            let bias = data["bias"];
            let bias_1 = data["bias-1"];
            let bias_2 = data["bias-2"];
            let max_border = max_border_size(my_graph)
            border_size = max_border >= 20 ? max_border : 20;
            let seperating_plane = line_through_border(slope, bias, border_size + 10);
            let margin_1 = line_through_border(slope, bias_1, border_size + 10);
            let margin_2 = line_through_border(slope, bias_2, border_size + 10);
            my_graph.data.datasets.push({
                label: bias >= 0 ? `y = ${slope}x + ${bias}` : `y = ${slope}x - ${-1*bias}`,
                data: seperating_plane,
                showLine: true,
                fill: false,
                pointStyle: 'line',
                borderColor: random_color(decision_boundary_colors)
            });
            my_graph.data.datasets.push({
                label: 'margin',
                data: margin_1,
                showLine: true,
                fill: false,
                borderDash: [10, 10],
                pointStyle: 'line',
                borderWidth: 1,
                borderColor: '#000'
            });
            my_graph.data.datasets.push({
                label: 'margin2',
                data: margin_2,
                showLine: true,
                fill: false,
                borderDash: [10, 10],
                pointStyle: 'line',
                borderWidth: 1,
                borderColor: '#000'
            });
            // clear data object for iteration of support vectors
            delete data.slope;
            delete data.bias;
            delete data.weight_norm;
            delete data.margin
            delete data.flag
            let sv_coords = [];
            Object.entries(data).forEach(point => {
                sv_coords.push({
                    'x': point[1][0],
                    'y': point[1][1]
                });
            })
            my_graph.data.datasets.push({
                label: 'Support Vectors',
                data: sv_coords,
                showLine: false,
                fill: false,
                borderColor: '#000',
                radius: 5
            });
            clear_button.style.display = "flex" // displays clear button
            my_graph.update();
        })
    }
    send_and_solve_SVM();
}

function solve_k_means() {
    if (!my_graph.data.datasets[0]) {
        show_error('Cannot perform k_means with no data');
        return;
    }
    // default to k = 3 if not entered
    let k = document.getElementById('input_k') === null ? 3 : document.getElementById('input_k').value
    const data = {
        'data': my_graph.data.datasets[0].data,
        'k': k
    }
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log('THE SENT DATA IS', JSON.stringify(data))
    async function send_and_solve_k_means() {
        await fetch('/api', options);
        console.log('finished awaiting');
        // fetch returning data from python script
        fetch('/k_means').then((response) => {
            console.log('THE RESPONSE IS', response)
            return response.json();
        }).then((data) => {
            console.log('The data is', data)
            if (data === 0) {
                show_error("Empty set occured, please pick a better K")
                return;
            }
            if (data === 1) {
                show_error('K bigger than number of data points')
                return;
            }
            clear_data(); // wipes data from graph to allow recoloring of data into clusters
            let data_set = [];
            centroids = data['centroids'];
            centroid_counter = 0;
            clusters = data['clusters'];
            for (centroid in centroids) {
                centroid_counter++;
                data_set.push({
                    'x': centroids[centroid][0],
                    'y': centroids[centroid][1]
                });
            }
            // make sure each cluster has a different color
            cluster_colors = shuffle(class_colors).slice(0, centroid_counter);
            cluster_colors.push('#eee');
            for (cluster in clusters) { // create clusters on graph
                cluster_data = []
                for (point in clusters[cluster]) {
                    cluster_data.push({
                        'x': clusters[cluster][point][0],
                        'y': clusters[cluster][point][1]
                    })
                };
                my_graph.data.datasets.push({
                    type: 'scatter',
                    label: `Cluster ${cluster}`,
                    data: cluster_data,
                    fill: false,
                    backgroundColor: cluster_colors[parseInt(cluster) - 1]
                });
            }
            my_graph.data.datasets.push({
                label: "Centroids",
                data: data_set,
                showLine: false,
                fill: false,
                pointStyle: 'triangle',
                backgroundColor: cluster_colors,
                borderColor: '#000',
                radius: 10
            });
            clear_button.style.display = "flex" // displays clear button
            my_graph.update()
        }).catch((err) => {
            console.log('rejected', err);
        })
    }
    send_and_solve_k_means();
}

function solve_decision_tree() {
    if (!my_graph.data.datasets[0]) {
        show_error('Cannot create decision tree with no data');
        return;
    }
    if (!my_graph.data.datasets[1]) {
        show_error('Cannot create decision tree with one class');
        return
    }
    const data = {
        '1': my_graph.data.datasets[0].data,
        '0': my_graph.data.datasets[1].data
    };
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log('THE SENT DATA IS', JSON.stringify(data))
    async function send_and_solve_decision_tree() {
        await fetch('/api', options);
        console.log('finished awaiting');
        fetch('/decision_tree').then((response) => {
            console.log('THE RESPONSE IS', response)
            return response.json();
        }).then((data) => {
            console.log('The data is', data)
            if (data === 0) {
                show_error('An unknown error occured');
                return;
            }
            // recieve pairs of points representing the lines and draw them on graph
            let max_border = max_border_size(my_graph)
            border_size = max_border >= 20 ? max_border : 20;
            let i = 0;
            color = random_color(decision_boundary_colors);
            for (line in data) {
                line_points = data[line]
                //new_color = pSBC(0.03, color, false, true);
                new_color = color
                my_graph.data.datasets.push({
                    label: `test${i}`,
                    data: line_points,
                    showLine: true,
                    fill: false,
                    pointStyle: 'line',
                    borderWidth: 2,
                    borderColor: new_color
                });
                i++;
                color = new_color;
            }
            clear_button.style.display = "flex" // displays clear button
            my_graph.update();
        }).catch((err) => {
            console.log('rejected', err);
        })
    }
    send_and_solve_decision_tree();
}