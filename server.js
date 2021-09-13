const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
var graph_data = "";

app.use(express.json());

// app.get('/',(req,res) => {
//   res.sendFile(path.join(__dirname+'/index.html'));
// });

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index2.html'));
});

app.post('/api', (req, res) => {
  // recieve array of objects, each representing a point
  graph_data = JSON.stringify(req.body);
  console.log('loaded data is', graph_data, 'and of type', typeof graph_data);
  res.end();
})

app.get('/log_reg', (req, res) => {
  let dataToSend;
  const python = spawn('py', ['logistic_regression.py', graph_data]);
  python.stdout.on('data', function (data) {
    dataToSend = data;
  });
  python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      let final_data = dataToSend;
      console.log('datatosend is', final_data);
      res.write(final_data);
      res.end();
  });
})

app.get('/svm', (req, res) => {
  let dataToSend;
  const python = spawn('py', ['svm2.py', graph_data]);
  python.stdout.on('data', function (data) {
    dataToSend = data;
  });
  python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      let final_data = dataToSend;
      console.log('datatosend is', final_data);
      res.write(final_data);
      res.end();
  });
})

app.get('/k_means', (req, res) => {
  let dataToSend;
  const python = spawn('py', ['k_means.py', graph_data]);
  python.stdout.on('data', function (data) {
    dataToSend = data;
  });
  python.stderr.on('data', function(data) {
    console.error(data.toString());
  });
  python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      let final_data = dataToSend;
      console.log('datatosend is', final_data);
      res.write(final_data);
      res.end();
  });
})



app.get('/lin_reg', (req, res) => {
  let dataToSend;
  const python = spawn('py', ['linear_regression.py', graph_data]);
  python.stdout.on('data', function (data) {
    dataToSend = data;
    if(dataToSend === '0') {
      console.log('Error occured in python scrip');
    }
  });
  python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      let final_data = dataToSend;
      console.log('datatosend is', typeof final_data);
      res.write(final_data);
      res.end();
  });
})


//add the router
// app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');