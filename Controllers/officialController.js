const Official = require("../Models/officalSchema")
const User = require('../Models/userModel')
const bcrypt = require('bcryptjs');
const { successHandler, errorHandler } = require("../middlewares/responseHandler");
const jwt = require('jsonwebtoken');
const SupportContact = require("../Models/supportScehma");

const signup = async (req, res) => {
    try {
        console.log(req.body);
        const userData = await User.findOne({ Email: req.body.Email })
        if (userData) {
            errorHandler({ name: "Email already exists" }, 501, res)
        } else {
            const officialData = await Official.create(req.body);
            
            const token = jwt.sign({ officialData,role:'offical' }, process.env.JWT_TOKEN, { expiresIn: '5h' });

            successHandler(res, 200, "official signed successfully", {officialData,token})
        }
    } catch (error) {
        console.error(error);
        errorHandler(error, 501, res)
    }
}


const login = async (req, res) => {
    try {
        console.log(req.body);
        const userData = await User.findOne({ Email: req.body.Email })
        if (userData) {
            if (bcrypt.compare(req.body.Password, userData.Password)) {
                successHandler(res, 201, "official signed successfully", userData)
            } else {
                throw new Error('Password do not match')
            }
        } else {
            const error = { name: "User not found" }
            errorHandler(error, 501, res)
        }
    } catch (error) {
        console.error(error);
        errorHandler(error, 501, res)
    }
}




module.exports = {
    signup, login
}