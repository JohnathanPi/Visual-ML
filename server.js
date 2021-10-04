const express = require('express');
const path = require('path');
const {
  spawn
} = require('child_process');

const app = express();
app.use(express.json());

let graph_data;
console.log('beginning graph data is', graph_data)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

process.on('unhandledRejection', (err) => {
  throw err;
});


app.post('/api', (req, res) => {
  // recieve array of objects, each representing a point
  console.log('IN API CALL');
  graph_data = ""
  graph_data = JSON.stringify(req.body);
  console.log('graph_data_is', graph_data);
  res.send({'data':graph_data});
  res.end();
})

app.get('/lin_reg', (req, res) => {
  let data_to_send;
  console.log('IN MODEL GRAPH DATA IS', graph_data);
  const python = spawn('python', ['models/linear_regression.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send += data;
    data_to_send = data_to_send.replace('undefined', '');
    console.log('IN API SENT DATA IS', data_to_send.toString("utf8"))
  });
  python.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
  python.on('close', (code) => {
    let final_data = data_to_send;
    console.log('CLOSING DATA IS IN API FORM', final_data.toString("utf8"), 'ASCII IS-', final_data.toString("utf8").charCodeAt(0), 'WITH CODE', code);
    graph_data = "";
    res.write(final_data);
    res.status(200).send();
    res.end();
  });
})

app.get('/log_reg', (req, res) => {
  let data_to_send;
  // spawn solver script
  console.log('IN MODEL GRAPH DATA IS', graph_data);
  const python = spawn('python', ['models/logistic_regression.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send += data;
    data_to_send = data_to_send.replace('undefined', '');
    console.log('IN API SENT DATA IS', data_to_send.toString("utf8"))
  });
  python.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
  python.on('close', (code) => {
    let final_data = data_to_send;
    // send data back
    console.log('CLOSING DATA IS IN API FORM', final_data.toString("utf8"));
    graph_data = "";
    res.write(final_data);
    res.status(200).send();
    res.end();
  });
})

app.get('/svm', (req, res) => {
  let data_to_send;
  console.log('IN MODEL GRAPH DATA IS', graph_data);
  const python = spawn('python', ['models/svm.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send += data;
    data_to_send = data_to_send.replace('undefined', '');
    console.log('IN API SENT DATA IS', data_to_send.toString("utf8"))
  });
  python.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
  python.on('close', (code) => {
    let final_data = data_to_send;
    console.log('CLOSING DATA IS IN API FORM', final_data.toString("utf8"));
    graph_data = "";
    res.write(final_data);
    res.status(200).send();
    res.end();
  });
})

app.get('/k_means', (req, res) => {
  let data_to_send;
  console.log('IN MODEL GRAPH DATA IS', graph_data);
  const python = spawn('python', ['models/k_means.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send += data;
    data_to_send = data_to_send.replace('undefined', '');
    console.log('IN API SENT DATA IS', data_to_send.toString("utf8"))
  });
  python.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
  python.on('close', (code) => {
    let final_data = data_to_send;
    console.log('CLOSING DATA IS IN API FORM', final_data.toString("utf8"));
    graph_data = "";
    res.write(final_data);
    res.status(200).send();
    res.end();
  });
})

app.get('/decision_tree', (req, res) => {
  let data_to_send;
  console.log('IN MODEL GRAPH DATA IS', graph_data);
  const python = spawn('python', ['models/decision_tree.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send += data;
    data_to_send = data_to_send.replace('undefined', '');
    console.log('IN API SENT DATA IS', data_to_send.toString("utf8"))
  });
  python.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });
  python.on('close', (code) => {
    let final_data = data_to_send;
    console.log('CLOSING DATA IS IN API FORM', final_data.toString("utf8"));
    graph_data = "";
    res.write(final_data);
    res.status(200).send();
    res.end();
  });
})

app.use(express.static(path.join(__dirname, 'public')));

let port = process.env.PORT || 8000;
app.listen(port);

console.log('Running at Port 8000!');