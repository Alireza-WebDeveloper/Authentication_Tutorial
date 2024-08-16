// 1 ) Requirement
const app = require('./app');
const logger = require('./config/logger.config');
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');

// Connection Mongoose Db

mongoose
  .connect('mongodb://localhost:27017/auth')
  .then(() => console.log('MongoDb Connected'));

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

const server = app.listen(PORT, () => {
  // logger.info('Is Running Port 8000');
  console.log('Server Is Running Port 8000');
});

// Handle Server Error

const exitHandler = () => {
  if (server) {
    logger.info('Server Closed.');
  }
};

const unExpectedErrorHandle = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unExpectedErrorHandle);
process.on('unhandledRejection', unExpectedErrorHandle);

// SIGTERM
process.on('SIGTERM', () => {
  if (server) {
    logger.info('Server Closed');
    process.exit(1);
  }
});
