const User = require("../Models/userModel");
const { cloudinary, uploadToCloudinary } = require("../Utils/cloudinary");
const upload = require("../Utils/multer");
const {
  errorHandler,
  successHandler,
} = require("../middlewares/responseHandler");
const { sendEmail } = require("../Utils/nodemailer");
const Official = require("../Models/officalSchema");

const sendConfirmationMessages = async (contactDetails, newReport) => {
  const { phone, email } = contactDetails;

  await sendSMS(
    phone,
    `Thank you for reporting. Your report ID is ${newReport._id}`
  );

  // Send email confirmation
  await sendEmail(
    email,
    "Report Confirmation",
    `Thank you for reporting. Your report ID is ${newReport._id}`
  );
};

const notifyNearestOfficials = async (location, newReport) => {
  const nearestOfficials = await findNearestOfficials(location);

  await Promise.all(
    nearestOfficials.map(async (official) => {
      const message = `New report: ${newReport._id}. Location: ${location}. Category: ${newReport.category}. Click here to view details: https://your-website.com/reports/${newReport._id}`;
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


module.exports = {
  placeReport: async (req, res, next) => {
    try {
      const userId = req.user._id
      const {
        userName,
        contactDetails,
        location,
        complaintText,
        severity,
        category,
        comments
      } = req.body;
      if (
        !userId ||
        !userName ||
        !location ||
        !complaintText ||
        !severity ||
        !category
      ) {
        throw new Error("Missing fields");
      }
      const audioUrl = req.files.audio
        ? await uploadToCloudinary(req.files.audio)
        : null;
      const videoUrl = req.files.video
        ? await uploadToCloudinary(req.files.video)
        : null;
      const imageUrls = req.files.images
        ? await Promise.all(
            req.files.images.map((file) => uploadToCloudinary(file))
          )
        : [];
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
        comments
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
  },

  

};



