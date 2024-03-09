const jwt = require('jsonwebtoken');
const { errorHandler } = require('./responseHandler');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) {
        let statusCode = 500;
        if (err.name === 'TokenExpiredError') {
            statusCode = 401; 
            errorHandler(err,statusCode,res,next);
        } else if (err.name === 'JsonWebTokenError') {
             statusCode = 401; 
            errorHandler(err,statusCode,res,next);
        } else {
            errorHandler(err,statusCode,res,next);
        }
      }

    req.user = user

    next()
  })
}


module.exports={
    authenticateToken
}