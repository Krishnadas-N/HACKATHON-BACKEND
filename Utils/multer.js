const multer = require("multer");
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const allowedImageExtensions = [".jpg", ".jpeg", ".png"];
    const allowedVideoExtensions = [".mp4", ".avi", ".mov"];
    let ext = path.extname(file.originalname);
    if (
        !allowedImageExtensions.includes(ext.toLowerCase()) &&
        !allowedVideoExtensions.includes(ext.toLowerCase())
      ) {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});