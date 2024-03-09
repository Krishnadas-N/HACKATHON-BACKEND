const express = require('express')
const router = express.Router()
const { signup, login, add } = require('../Controllers/officialController')



router.post('/signup', signup)
router.post('/login', login);






module.exports = router