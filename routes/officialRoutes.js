const express = require('express')
const router = express.Router()
const { signup, login, userContactRequest,userReport } = require('../Controllers/officialController')




router.post('/signup', signup);

router.post('/login', login);

router.get('/report/:reportId', userReport);

router.post('/:reportId/contact',userContactRequest);






module.exports = router