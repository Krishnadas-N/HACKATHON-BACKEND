const express = require('express')
const router = express.Router()
const { signup, login, userReport } = require('../Controllers/officialController')

router.post('/signup', signup)
router.post('/login', login)
router.get('/report/:reportId', userReport)
router.get('/of5')






module.exports = router