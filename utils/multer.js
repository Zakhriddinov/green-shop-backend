const multer = require("multer");
const path = require("path");

// Initialize upload
const upload = multer({
   storage: multer.diskStorage({}),
   limits: { fileSize: 1024*1024 },
   fileFilter: function (req, file, cb) {
      checkFileType(file, cb)
   }
})

// Check file for image
function checkFileType(file, cb) {
   const filetypes = /jpeg|jpg|png|gif/
   const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())

   const mimetype = filetypes.test(file.mimetype)

   if (mimetype && extname) {
      return cb(null, true)
   } else {
      cb('Error: You can only upload image files')
   }
}

module.exports = upload