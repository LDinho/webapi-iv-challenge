require('dotenv').config();

const server = require('./api/server');

const PORT = process.env.PORT || 8002;

const message = 'Server Running on';

const portAndMessage = `\n*** ${message} http://localhost:${PORT} ***\n`;

// listening
server.listen(PORT, () => {
  console.log(portAndMessage);

});
