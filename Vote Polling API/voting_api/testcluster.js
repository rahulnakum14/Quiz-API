const express = require("express");
const app = express();
const port = 3000;
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // Create worker processes (one per CPU core)
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Forking another worker!");
    cluster.fork();
  });
} else {
  app.get('/heavy',(req,res) => {
            return res.json("Successfully processed request!");
          })
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
// Example CPU-intensive task (Fibonacci calculation)
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}


// const express = require("express");
// const app = express();
// const port = 3000;
// const cluster = require("cluster");
// const totalCPUs = require("os").cpus().length;

// if (cluster.isMaster) {
//   console.log(`Number of CPUs is ${totalCPUs}`);
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     console.log("Let's fork another worker!");
//     cluster.fork();
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
//     let total = 0;
//     app.get('/heavy',(req,res) => {
//         let total = 0;
//         for(let i =0; i<50_000;i++){
//             total++
//         }
//       })
//       app.listen(port, () => {
//         console.log(`App listening on port ${port}`);
//       });
// }


/*
const express = require("express");

const app = express();

const port = 3000;

const cluster = require("cluster");

const totalCPUs = require("os").cpus().length;



if (cluster.isMaster) {

  // Create worker processes (one per CPU core)

  for (let i = 0; i < totalCPUs; i++) {

    cluster.fork();

  }



  cluster.on("exit", (worker, code, signal) => {

    console.log(`Worker ${worker.process.pid} died`);

    console.log("Forking another worker!");

    cluster.fork();

  });

} else {

  app.get('/heavy',(req,res) => {

            let total = 0;

            for(let i =0; i<5000;i++){

                total++

            }

          })

  app.listen(port, () => {

    console.log(`App listening on port ${port}`);

  });

} here when i test it with loadtest.cmd http://localhost:3000/heavy -n 1000 -c 100 then it shows Requests: 0 (0%), requests per second: 0, mean latency: 0 ms

Requests: 0 (0%), requests per second: 0, mean latency: 0 ms then after some time shows 

Completed requests: 1000

Total errors:    1000

Total time:     13.382 s

Mean latency:    13334.6 ms

Effective rps:    75 why ???? corretc it 

*/