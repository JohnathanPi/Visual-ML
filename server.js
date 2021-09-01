const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
let graph_data = "";

app.use(express.json());

app.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.post('/api', (req, res) => {
  // recieve array of objects, each representing a point
  graph_data = req.body;
  console.log('loaded data is', graph_data[0]);
  res.end();
})


app.get('/python', (req, res) => {
  let dataToSend;
  // spawn new child process to call the python script
  const python = spawn('py', ['test.py', "[ {'x': 5, 'y' : 4}, {'x': 2, 'y' : 3}  ]"]);
  // collect data from script
  python.stdout.on('data', function (data) {
    dataToSend = data;
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      let final_data = dataToSend;
      console.log('datatosend is', final_data);
      res.write(final_data);
      res.end();
  });

})


//add the router
// app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');