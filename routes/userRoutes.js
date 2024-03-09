const express = require('express');
const { authenticateToken } = require('../middlewares/userAuthentication');
const { placeReport } = require('../Controllers/userController');

const  user_Router = express.Router();

user_Router.post('/report-complaint',authenticateToken,upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),placeReport)





module.exports=user_Router