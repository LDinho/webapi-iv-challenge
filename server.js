const express = require('express');

const server = express();

// import routers
const userRouter = require("./users/userRouter");


//GLOBAL Middleware

// built in middleware
server.use(express.json()); // parses body

//custom middleware
server.use(logger);

// routers - users
server.use("/api/users", userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

function logger(req, res, next) {
  console.log(`${new Date().toISOString()}: ${req.method} to ${req.url}`);
  next();
}

module.exports = server;
