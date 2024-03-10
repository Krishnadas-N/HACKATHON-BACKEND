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






const signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, email, phone, role, location= { type: 'Point', coordinates: [0, 0] }, governmentId, isGovernmentRecognized, status='Available' } = req.body;

        const userData = await Official.findOne({ email });
        if (userData) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newOfficial = new Official({
            name,
            email,
            phone,
            role,
            location,
            governmentId,
            isGovernmentRecognized,
            status
        });

        const savedOfficial = await newOfficial.save();

        const token = jwt.sign({ officialData: savedOfficial, role: 'official' }, process.env.JWT_TOKEN, { expiresIn: '5h' });

        // Respond with success message and token
        res.status(200).json({ message: 'Official signed up successfully', officialData: savedOfficial, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const login = async (req, res,next) => {
    try {
        console.log(req.body);
        const userData = await User.findOne({ Email: req.body.Email })
        if (userData) {
            if (bcrypt.compare(req.body.Password, userData.Password)) {
                const token = jwt.sign({ user:userData,role:'official' }, process.env.JWT_TOKEN, { expiresIn: '5h' });
                successHandler(res, 201, "official signed successfully", {token});
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

const userReport = async (req, res,next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.reportId)) {
            const userData = await Report.findById(req.params.reportId)
            if (userData) {
                successHandler(res, 201, "request success", userData)
            } else {
                errorHandler({ name: "document not found" }, 501, res)
            }
        } else {
            errorHandler({ name: "the id is not a valid object id " }, 501, res)
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



const userContactRequest = async(req,res,next)=>{
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
       next(error)
    }
}


const getCompliants = async(req,res,next)=>{
    try{
        const reports = await Report.find({}, 'userName complaintText severity category status createdAt updatedAt')
        .populate('userId', 'username')
        .populate('assignedOfficial', 'name email phone')
        successHandler(res, 201, "request success", {reports})
    }catch(error){
    console.error('get compaint home:', error);
       next(error)
    }
}


module.exports = {
    signup, login ,userContactRequest,userReport,getCompliants
}