const express = require('express');
const { authenticateToken } = require('../middlewares/userAuthentication');
const upload =  require('../Utils/multer')
const { placeReport,postLogin,
  getAwarnessData,
  Signup, 
  respondOfficalRequest,
  getComplaint,
  getComplaintId} = require('../Controllers/userController');

const  user_Router = express.Router();

user_Router.post('/report-complaint',authenticateToken,upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),placeReport)


user_Router.get('/home',authenticateToken,getAwarnessData);

user_Router.post('/login',postLogin);

user_Router.post('/signup',Signup);

user_Router.get('/get-complaints',authenticateToken,getComplaint);

user_Router.post('/:reportId/:response',respondOfficalRequest);

user_Router.get('/get-complaintDetail/:reportId',authenticateToken,getComplaintId)

module.exports=user_Router