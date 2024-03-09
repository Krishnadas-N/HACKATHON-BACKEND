const cloudinary = require("cloudinary")
  .v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
      if (error) {
        console.error('Error uploading file to Cloudinary:', error);
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
};
module.exports = {cloudinary,uploadToCloudinary};