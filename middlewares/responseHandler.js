function successHandler(req, res, statusCode, message, data) {
    res.status(statusCode).json({
      success: true,
      message: message,
      data: data
    });
  }

  

  function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: err.name || 'Internal Server Error',
      error: err.message
    });
  }

  
module.exports={
    successHandler :successHandler ,
    errorHandler : errorHandler
}