const logEvent = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvent(`${err.name}: ${err.message}`, "errorLog.txt");
  console.log(err.stack);
  console.log("error handler");
  const { statusCode = 500 } = err;
  res.status(statusCode).json({
    "error-code": statusCode,
    message: err.message,
  });
};

module.exports = errorHandler;
