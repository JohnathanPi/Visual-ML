const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();

const router = express.Router();

router.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/python', (req, res) => {
  let dataToSend;
  // spawn new child process to call the python script
  const python = spawn('py', ['test.py', 'node.js', 'python']);
  // collect data from script
  python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      res.send(dataToSend)
  });

})

//add the router
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');