
 //Catches all errors and returns consistent JSON responses
 
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default to 500 if no status provided
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // Send consistent JSON error response
  res.status(status).json({
    error: {
      status,
      message
    }
  });
}

module.exports = errorHandler;