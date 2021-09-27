const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
var graph_data = "";

app.use(express.json());

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.post('/api', (req, res) => {
  // recieve array of objects, each representing a point
  graph_data = JSON.stringify(req.body);
  res.end();
})

app.get('/log_reg', (req, res) => {
  let data_to_send;
  // spawn solver script
  const python = spawn('py', ['models/logistic_regression.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send = data;
  });
  python.on('close', (code) => {
      let final_data = data_to_send;
      // send data back
      res.write(final_data);
      res.end();
  });
})

app.get('/svm', (req, res) => {
  let data_to_send;
  const python = spawn('py', ['models/svm.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send = data;
  });
  python.on('close', (code) => {
      let final_data = data_to_send;
      res.write(final_data);
      res.end();
  });
})

app.get('/k_means', (req, res) => {
  let data_to_send;
  const python = spawn('py', ['models/k_means.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send = data;
  });
  python.on('close', (code) => {
      let final_data = data_to_send;
      res.write(final_data);
      res.end();
  });
})



app.get('/lin_reg', (req, res) => {
  let data_to_send;
  const python = spawn('py', ['models/linear_regression.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send = data;
  });
  python.on('close', (code) => {
      let final_data = data_to_send;
      res.write(final_data);
      res.end();
  });
})

app.get('/decision_tree', (req, res) => {
  let data_to_send;
  const python = spawn('py', ['models/decision_tree.py', graph_data]);
  python.stdout.on('data', function (data) {
    data_to_send = data;
  });
  python.on('close', (code) => {
      let final_data = data_to_send;
      res.write(final_data);
      res.end();
  });
})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');