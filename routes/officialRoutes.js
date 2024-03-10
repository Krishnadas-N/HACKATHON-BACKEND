const express = require('express')
const router = express.Router()
const { signup, login, userContactRequest,userReport } = require('../Controllers/officialController');
const { Officialauthenticate, authenticateToken } = require('../middlewares/userAuthentication');




router.post('/signup', signup);

router.post('/login', login);

router.get('/report/:reportId',authenticateToken,Officialauthenticate, userReport);

router.post('/:reportId/contact',authenticateToken,Officialauthenticate,userContactRequest);

router.get('/home',authenticateToken,Officialauthenticate,)




module.exports = router