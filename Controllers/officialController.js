const Official = require("../Models/officalSchema")
const User = require('../Models/userModel')
const bcrypt = require('bcryptjs');
const { successHandler, errorHandler } = require("../middlewares/responseHandler");

const signup = async (req, res) => {
    try {
        console.log(req.body);
        const userData = await User.findOne({ Email: req.body.Email })
        if (userData) {
            errorHandler({ name: "Email already exists" }, 501, res)
        } else {
            req.body.Password = await bcrypt.hash(req.body.Password, 10)
            const officialData = await Official.insertMany(req.body)[0]
            successHandler(res, 200, "official signed successfully", officialData)
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
                const error = { name: "Password do not match" }
                errorHandler(error, 501, res)
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