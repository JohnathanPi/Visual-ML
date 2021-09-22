// MISC
////////////////////////////////////////////////////////////
var ctx = document.getElementById('my_graph').getContext('2d');
let colors = ['#020c64', '#09df8a', '#7400b8', '#f4845f', '#f3a338',
    '#bd2ea4', '#e08ab7', '#fa1b73', '#f7e27e',
    '#c0aeed', '#a11d33', '#0083e2', '#00a6fb'
];

const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

let randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
};
let max_val = 20;

document.getElementById('my_graph').onmousedown = (event) => {
    onClickHandler(event);
}


function perpendicular_line(value, axis, border) {
    if (axis === 1) {
        point_1 = {'x': -border, 'y': value} 
        point_2 = {'x': border, 'y': value} 
    } else if (axis === 0) {
        point_1 = {'x': value, 'y': -border} 
        point_2 = {'x': value, 'y': border} 
    }
    return [point_1, point_2]
} 

function line_through_border(slope, bias, border) {
    // find the sides where the line intercepts the graphs border
    if (slope === 0) {
        console.log('slope 0')
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
    return final_points.slice(0, 2);
}

function show_data_box() {
    let data_enter_div = document.getElementById("data_input_1");
    if (data_enter_div.style.display === 'none' || data_enter_div.style.display === '') {
        data_enter_div.style.display = 'flex';
    } else {
        data_enter_div.style.display = 'none';
    }
};

function get_lin_reg_type() {
    let reg_type = document.getElementById('reg-selector');
    return reg_type.value - 1;
}

function get_lin_reg_lambda() {
    let lambda = document.getElementById('input_lambda_lin_reg');
    return lambda.value
}

function show_error(msg) {
    error = document.getElementById('error');
    error.textContent = msg;
    error.style.color = "red"
    setTimeout(function() {
        error.textContent = '';
    }, 1000);
}

function check_readonly() {
    let label_input = document.getElementById('input_labels');
    let log_reg_div = document.getElementById('log_reg_div');
    let svm_div = document.getElementById('svm_div');
    let add_data_btn = document.getElementById('add_data_btn');
    if (log_reg_div.style.display === 'flex' || svm_div.style.display === 'flex') {
        label_input.readOnly = false;
        add_data_btn.onclick = parse_labled_data;

    } else {
        label_input.value = "";
        label_input.readOnly = true;
        add_data_btn.onclick = parse_data;
    } 
}

function setting_switch() {
    let solve_buttons = document.querySelectorAll('.solve_btn')
    let chosen_model = document.getElementById('model-selector');
    let model_divs = document.querySelectorAll('.model_div')
    let i = 0;
    solve_buttons.forEach((solve_button) => {
        i++;
        if (chosen_model.value === String(i)) {
            solve_button.style.display = 'block';
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
    // check_readonly();
    clear_data();
}

let calc_func_y = (a, b, x) => {
    return a * x + b;
};

let calc_func_x = (a, b, y) => {
    return (y - b) / a;
};

function shuffle(array) {
    let copy = [], n = array.length, i;
    while (n) {
        i = Math.floor(Math.random() * array.length);
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }
    return copy;
}

function add_datasets(graph, curr_sets) {
    if (graph.data.datasets.length === curr_sets) {
        graph.data.datasets.push({
            type: 'scatter',
            label: `Class ${curr_sets + 1}`,
            data: [],
            fill: false,
            backgroundColor: randomColor()
        });
    }
}

function onClickHandler(click) {
    let curr_scale, x_val, y_val;
    let flag = 1;
    if (click.button == 2) {
        flag = 2;
    }
    for (let scale in my_graph.scales) {
        curr_scale = my_graph.scales[scale];
        if (scale == 'x') {
            x_val = curr_scale.getValueForPixel(click.offsetX);
        } else if (scale == "y") {
            y_val = curr_scale.getValueForPixel(click.offsetY);
        }
    }

    if (x_val > my_graph.scales['x'].min &&
        x_val < my_graph.scales['x'].max &&
        y_val > my_graph.scales['y'].min &&
        y_val < my_graph.scales['y'].max) {
        if (flag == 1) {
            add_datasets(my_graph, 0);
            my_graph.data.datasets[0].data.push({
                'x': Math.round(x_val),
                'y': Math.round(y_val)
            });
        } else if (flag == 2) {
            add_datasets(my_graph, 1)
            my_graph.data.datasets[1].data.push({
                'x': Math.round(x_val),
                'y': Math.round(y_val)
            })
        }
    }
    my_graph.update();
}



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
//////////////////////////////////////////
// DATA HANDLING ////////////////////////
/////////////////////////////////////////
function extract_data(user_data_string) {
    // CONSIDER ADDING SQUARED BRACKETS SINCE NUMPY ARRAYS
    const coords = /\((\-?\d+\,\-?\d+)\)/g; // validate legal pairs of coordinates
    let preprocessed_data = user_data_string.replace(/ /g, "").replace(/\[|\]/g, "")
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
        add_datasets(my_graph, 0);
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


function parse_labled_data() {
    const new_labled_data = document.getElementById('input_data').value;
    const new_lables = document.getElementById('input_labels').value;
    const lables = new_lables.split `,`.map(x => +x);
    let parsed_data = new_labled_data.replace(/\(/g, "[").replace(/\)/g, "]");
    let data_points = JSON.parse("[" + parsed_data + "]");
    labled_data_points = data_points.map(function (data, i) {
        return [data, lables[i]];
    });
    // if (!my_graph.data.datasets[1]) {
    //     my_graph.data.datasets.push({
    //         type: 'scatter',
    //         label: "Data label 2",
    //         data: [],
    //         fill: false,
    //         backgroundColor: randomColor()
    //     });
    // };
    add_datasets(my_graph, 0);
    add_datasets(my_graph, 1);
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
    document.getElementById('input_data').value = "";
    document.getElementById('input_labels').value = "";
    console.log(my_graph.data.datasets[0]);
    console.log(my_graph.data.datasets[1]);
    my_graph.update();
}


function clear_data(flag = 1) {
    if (!flag) {
        my_graph.data.datasets = [];
    }
    my_graph.data.datasets.forEach(dataset => {
        if (dataset.label != 'axis') {
            dataset.data = [];
        };
    });
    my_graph.data.datasets = [];
    my_graph.update();
};
///////////////////////////////////////////////
// SERVERSIDE MODEL RUNNING //////////////////
//////////////////////////////////////////////

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
    fetch('/lin_reg').then((response) => {
            return response.json();
        }).then((data) => {
            if (data === 0) {
                // Need to show this directly to user !
                show_error("Not enoguh data")
                throw new Error("Not enough data")
            }
            if (data === 1) {
                show_error("Cannot perform regression with infinite slope")
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

function solve_logistic_regression() {
    const data = {
        '1': my_graph.data.datasets[0].data,
        '0': my_graph.data.datasets[1].data
    };
    console.log(data);
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api', options)
    fetch('/log_reg').then((response) => {
        return response.json();
    }).then((data) => {
        if (data === 0) {
            my_graph.data.datasets.push({
                label: 'test',
                data: [{
                    'x': 15,
                    'y': 30
                }, {
                    'x': 15,
                    'y': -30
                }],
                showLine: true,
                fill: false,
                pointStyle: 'line',
                borderColor: randomColor()
            });
            my_graph.update();
            return
        } else {
            console.log('the data is', data)
            let slope = data["slope"];
            let bias = data["bias"];
            let acc = data["accuracy"]
            console.log(`y = ${slope}x + ${bias}`)
            // need to graph y = x*slope + bias
            // find min and max points in curr dataset
            border_size = max_val >= 20 ? max_val : 20;
            // edge cases (slope = 0) 
            let seperating_plane = line_through_border(slope, bias, border_size + 10);
            console.log('sep plane is', seperating_plane)
            my_graph.data.datasets.push({
                label: bias >= 0 ? `y = ${slope}x + ${bias} | accuracy = ${acc}` : `y = ${slope}x - ${-1*bias} | accuracy = ${acc}`,
                data: seperating_plane,
                showLine: true,
                fill: false,
                pointStyle: 'line',
                borderColor: randomColor()
            });
            my_graph.update();

        }
    })
}


function solve_svm() {
    const data = {
        '1': my_graph.data.datasets[0].data,
        '-1': my_graph.data.datasets[1].data
    };
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
        let bias_1 = data["bias-1"];
        let bias_2 = data["bias-2"];
        // let margin = data['margin_dist'];
        // console.log('margin is', margin)
        // console.log('weight norm is', weight_norm)
        // console.log('margin time sweight norm', margin*weight_norm[0] + margin*weight_norm[1])
        border_size = max_val >= 20 ? max_val : 20;
        // edge cases (slope = 0) 
        let seperating_plane = line_through_border(slope, bias, border_size + 10);
        //let margin_1 = line_through_border(slope, bias - (margin*weight_norm[0][0] + margin*weight_norm[0][1]), border_size + 10);
        //let margin_2 = line_through_border(slope, bias + (margin*weight_norm[0][0] + margin*weight_norm[0][1]), border_size + 10);
        let margin_1 = line_through_border(slope, bias_1, border_size + 10);
        let margin_2 = line_through_border(slope, bias_2, border_size + 10);
        my_graph.data.datasets.push({
            label: bias >= 0 ? `y = ${slope}x + ${bias}` : `y = ${slope}x - ${-1*bias}`,
            data: seperating_plane,
            showLine: true,
            fill: false,
            pointStyle: 'line',
            borderColor: randomColor()
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
        delete data.slope;
        delete data.bias;
        delete data.weight_norm;
        delete data.margin
        console.log('data is', data)
        let sv_coords = [];
        Object.entries(data).forEach(point => {
            sv_coords.push({
                'x': point[1][0],
                'y': point[1][1]
            });
            console.log('sv coords are', sv_coords);
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
    })
}


function solve_k_means() {
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
    fetch('/api', options)
    // fetch returning data from python script
    fetch('/k_means').then((response) => {
        // console.log(response.json())
        return response.json();
    }).then((data) => {
        if (data === 0) {
            throw new Error("Empty set occured, k not suitable !")
        }
        clear_data(0);
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
        cluster_colors = shuffle(colors).slice(0, centroid_counter);
        cluster_colors.push('#eee');
        for (cluster in clusters) {
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
        my_graph.update()

    }).catch((err) => {
        console.log('rejected', err);
    })
}

function solve_decision_tree() {
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
    fetch('/api', options)
    fetch('/decision_tree').then((response) => {
        return response.json();
    }).then((data) => {
        border_size = max_val >= 20 ? max_val : 20;
        console.log('the whole returned data is ', data);
        let i = 0;
        color = '#e00';
        for (line in data) {
            console.log('line is', data[line])
            line_points = data[line]
            new_color = pSBC (0.03, color, false, true);
            my_graph.data.datasets.push({
                label: `test${i}`,
                data: line_points,
                showLine: true,
                fill: false,
                // borderDash: [10, 10],
                pointStyle: 'line',
                borderWidth: 2,
                borderColor: new_color
            });
            i++;
            color = new_color;
            my_graph.update();
        }

    })
}