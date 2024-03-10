const express = require('express')
const router = express.Router()
const { signup, login, userContactRequest } = require('../Controllers/officialController')



router.post('/signup', signup);

router.post('/login', login);

router.post('/:reportId/contact',userContactRequest);






module.exports = router