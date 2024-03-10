const multer = require("multer");
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    console.log(file)
    const allowedImageExtensions = [".jpg", ".jpeg", ".png",".webp"];
    const allowedVideoExtensions = [".mp4", ".avi", ".mov",".webp"];
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