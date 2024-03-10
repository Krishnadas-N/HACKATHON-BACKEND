const express = require('express')
const router = express.Router()
const { signup, login, userContactRequest,userReport, getCompliants } = require('../Controllers/officialController');
const { Officialauthenticate, authenticateToken } = require('../middlewares/userAuthentication');




router.post('/register', signup);

router.post('/login', login);

router.get('/report/:reportId',authenticateToken,Officialauthenticate, userReport);

router.post('/:reportId/contact',authenticateToken,Officialauthenticate,userContactRequest);

router.get('/home',authenticateToken,Officialauthenticate,getCompliants)




module.exports = router;