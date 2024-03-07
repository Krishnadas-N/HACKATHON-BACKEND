const jwt = require('jsonwebtoken');
const { errorHandler } = require('./responseHandler');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) {
        if (err.name === 'TokenExpiredError') {
            errorHandler(err,req,res,next);
        } else if (err.name === 'JsonWebTokenError') {
            errorHandler(err,req,res,next);
        } else {
            errorHandler(err,req,res,next);
        }
      }

    req.user = user

    next()
  })
}


module.exports={
    authenticateToken
}