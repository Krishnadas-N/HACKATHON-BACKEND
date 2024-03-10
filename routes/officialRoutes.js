const express = require('express')
const router = express.Router()
const { Officialauthenticate, authenticateToken } = require('../middlewares/userAuthentication');
const
    {
        signup,
        login,
        userContactRequest,
        userReport,
        getCompliants
    } = require('../Controllers/officialController');




router.post('/signup', signup);

router.post('/login', login);

router.get('/report/:reportId', authenticateToken, Officialauthenticate, userReport);

router.post('/:reportId/contact', authenticateToken, Officialauthenticate, userContactRequest);

router.get('/home', authenticateToken, Officialauthenticate, getCompliants)




module.exports = router