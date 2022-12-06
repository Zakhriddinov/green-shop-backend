const cloudinary = require("cloudinary").v2;

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryImageUploadMethod = async file => {
   return new Promise(resolve => {
      cloudinary.uploader.upload(file, { folder: "green-shop" }, (err, res) => {
         if (err) return res.status(500).send("upload image error")
         resolve({
            url: res.secure_url,
            public_id: res.public_id
         })
      })
   })
}
const cloudinaryImageDeleteMethod = async (file) => {
   await cloudinary.uploader.destroy(file.public_id)
}
module.exports = { cloudinaryImageUploadMethod, cloudinaryImageDeleteMethod, cloudinary }
