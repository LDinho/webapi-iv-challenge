const server = require('./server');

const port = 8005;

const message = 'Server is running on';

const portAndMessage =
  `\n*** ${message} http://localhost:${port} ***\n`;

// listening
server.listen(port, ()=> {
  console.log(portAndMessage);

});
