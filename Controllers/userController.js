const User = require("../Models/userModel");
const { cloudinary, uploadToCloudinary } = require("../Utils/cloudinary");
const upload = require("../Utils/multer");
const {
  errorHandler,
  successHandler,
} = require("../middlewares/responseHandler");
const { sendEmail } = require("../Utils/nodemailer");
const Official = require("../Models/officalSchema");
const jwt = require('jsonwebtoken');
const { getSupportContactInfo } = require("../Utils/supportUtils");
const Report = require("../Models/reportSchema");
const SupportContact = require("../Models/supportScehma");
const { default: mongoose } = require("mongoose");





const sendConfirmationMessages = async (contactDetails, newReport) => {
  const { phone, email } = contactDetails;
  const supportInfo = await getSupportContactInfo();
  const acknowledgmentMessage = `Thank you for reporting. Your report ID is ${newReport._id}. For immediate assistance or further support, please contact:
  Hotline: ${supportInfo.hotline}
  Counseling Service: ${supportInfo.counselingService}
  Local Support Organization: ${supportInfo.localSupportOrg}`;
  await sendSMS(phone, acknowledgmentMessage);

  // Send email confirmation
  await sendEmail(
    email,
    "Report Confirmation",
    acknowledgmentMessage
  );
};

const notifyNearestOfficials = async (location, newReport) => {
  const nearestOfficials = await findNearestOfficials(location);

  await Promise.all(
    nearestOfficials.map(async (official) => {
      const message = `New report: ${newReport._id}. Location: ${location}. Category: ${newReport.category}. Click here to view details: localhost:3000/official/reports/${newReport._id}`;
      await sendEmail(official.contactInfo.email, message);
    })
  );
};

const sendSMS = async (phoneNumber, message) => {
  const from = "Vonage APIs";
  const to = phoneNumber;
  const text = message;

  await Vonages.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
};

const findNearestOfficials = async (referencePoint, maxDistance) => {
  try {
    const nearestOfficials = await Official.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [referencePoint.longitude, referencePoint.latitude]
          },
          $maxDistance: maxDistance * 100 // Convert max distance to meters
        }
      },
      status: 'Available'
    }).exec();

    return nearestOfficials;
  } catch (error) {
    console.error('Error finding nearest officials:', error);
    throw error;
  }
};




const notifyOfficialContactReposnse = async (officialEmail, reportId, repsonse) => {

  if (repsonse === 'Approved') {
    const contactLink = `http://yourwebsite.com/reports/${reportId}/contact-user`
    const mailOptions = {
      from: process.env.EMAIL,
      to: officialEmail,
      subject: 'Contact Request Approved',
      text: `The contact request for report ID ${reportId} has been approved.
      You can now contact the user using the following link: ${contactLink}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent: ',);
  } else if (repsonse === "Rejected") {

    const mailOptions = {
      from: process.env.EMAIL,
      to: officialEmail,
      subject: 'Contact Request Rejected',
      text: `The contact request for report ID ${reportId} has been rejected by the user.`
    };
    await transporter.sendMail(mailOptions);
  } else {
    throw new Error('Invalid Response')
  }
};



const placeReport = async (req, res, next) => {
  try {
    const userId = req.user._id
    const {
      userName, contactDetails, location, complaintText,
      severity, category, 
    } = req.body;

    if (!userId || !userName || !location || !complaintText || !severity || !category) {
      throw new Error("Missing fields");
    }

    const audioUrl = req.files.audio ? await uploadToCloudinary(req.files.audio) : null;
    const videoUrl = req.files.video ? await uploadToCloudinary(req.files.video) : null;
    const imageUrls = req.files.images ? await Promise.all(req.files.images.map((file) => uploadToCloudinary(file))) : [];
    const newReport = new Report({
      userId,
      userName,
      contactDetails,
      location,
      complaintText,
      severity,
      category,
      audio: { url: audioUrl },
      video: { url: videoUrl },
      images: imageUrls,
    });

    await newReport.save();

    await sendConfirmationMessages(contactDetails, newReport);

    await notifyNearestOfficials(location, newReport);

    successHandler(
      res,
      201,
      (message = "Report placed successfully"),
      (data = { report: newReport })
    );
  } catch (error) {
    console.error("Error placing report:", error);
    next(error);
  }
}


const getAwarnessData = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, 'WomenAwarness.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');

    const awarenessData = JSON.parse(jsonData);
    successHandler(
      res,
      201,
      { awarenessData: awarenessData }
    )
  } catch (err) {
    console.error('Error reading awareness data:', err);
    next(err);
  }
}


const postLogin = async (req, res, next) => {
  try {
    console.log(req.body, "this is a request");
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      throw new Error("Please provide both Email and Password");
    }

    const user = await User.findOne({ Email }).select('+Password').lean().exec();

    if (!user) {
      throw new Error(`No account found with email: ${Email}`);
    }

    const isPasswordMatch = await bcrypt.compare(Password, user.Password);

    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ user, role: 'user' }, process.env.JWT_TOKEN, { expiresIn: '5h' });

    successHandler(res, 200, 'Logged In Successfully', { token });
  } catch (err) {
    console.error("ERROR IN LOGIN", err);
    next(err);
  }
};


const Signup = async (req, res, next) => {
  try {
    const { userName, Email, Password, Phone } = req.body;
    console.log(req.body, userName, Email, Password, Phone);
    if (!userName || !Email || !Password || !Phone) {
      throw new Error("Please provide all required fields");
    }
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser = new User({
      userName,
      Email,
      Password,
      Phone
    });

    await newUser.save();

    successHandler(res, 200, 'User signed up successfully', { newUser });
  } catch (err) {
    console.error("ERROR IN SIGNUP", err);
    next(err);
  }
};


const getComplaint = async (req, res, next) => {
  try {
    const userId = req.user._id
    const userConplaints = await Report.find({ _id: userId });
    successHandler(res, 200, "Successfully fetched complaints", userConplaints);
  } catch (err) {
    console.error("ERROR IN SIGNUP", err);
    next(err);
  }
}


const respondOfficalRequest = async (req, res, next) => {
  try {
    console.log("responese to offica requestt      ///");
    const reportId = req.params.reportId;
    const response = req.params.response;

    const report = await Report.findById(reportId);
    if (response.toLowerCase() === 'approve') {
      report.userResponse = 'Approved';
      await notifyOfficialContactReposnse(report.assignedOfficial.email, reportId, report.userResponse)
    } else if (response.toLowerCase() === 'reject') {
      report.userResponse = 'Rejected';
      await notifyOfficialContactReposnse(report.assignedOfficial.email, reportId, report.userResponse);
    } else {
      throw new Error('Invalid response. Please respond with "Approve" or "Reject".');
    }

    await report.save();

    // Function to notify the official that the contact request has been approved

    successHandler(res, 200, 'User response submitted successfully');
  } catch (error) {
    console.error('Error submitting user response:', error);
    next(error);
  }
}



const getComplaintId = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.reportId)) {
      throw new Error('Invalid Complaint Id')
    }
    const reportId = req.params.reportId;
    const report = await Report.findById(reportId);

    if (!report) {
      throw new Error('No reports Find this Id')
    }
    successHandler(res, 200, 'Complaint Fetched Successfully', { report });
  } catch (error) {
    next(error);
  }
}



module.exports = {
  placeReport,
  postLogin,
  getComplaint,
  getAwarnessData,
  Signup,
  getComplaintId,
  respondOfficalRequest
}





