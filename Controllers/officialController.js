const Official = require("../Models/officalSchema")
const User = require('../Models/userModel')
const bcrypt = require('bcryptjs');
const { successHandler, errorHandler } = require("../middlewares/responseHandler");
const jwt = require('jsonwebtoken');
const SupportContact = require("../Models/supportScehma");
const Report = require('../Models/reportSchema')
const mongoose = require('mongoose');
const { transporter } = require("../Utils/nodemailer");
require('dotenv').config()

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


const sendContactRequestNotification = async (userEmail, reportId, officialName, officialEmail, message) => {
    const approveLink = `http://yourwebsite.com/reports/${reportId}/approve`;
    const rejectLink = `http://yourwebsite.com/reports/${reportId}/reject`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Contact Request Received',
        text: `You have received a contact request regarding your report with ID ${reportId}. 
               The official ${officialName} (${officialEmail}) wants to contact you. 
               Message: ${message}
               Do you approve this contact request? 
               Please click the following link to approve: ${approveLink}
               or click this link to reject: ${rejectLink}`
    };

    await transporter.sendMail(mailOptions);
};



const userContactRequest = async(req,res)=>{
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.reportId)){
            throw new Error('Invalid Report Id')
        }
        const { name, email,phone, message } = req.body;
        const reportId = req.params.reportId;

        await Report.findByIdAndUpdate(reportId, {
            officialContact: { name, email,phone },
            officialMessage: message
        });

        const report = await Report.findById(reportId).populate('userId');
        await sendContactRequestNotification(report.userId.Email, reportId, name, email, message);

        res.status(200).json({ message: 'Contact request submitted successfully' });
    } catch (error) {
        console.error('Error submitting contact request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {
    signup, login ,userContactRequest
}