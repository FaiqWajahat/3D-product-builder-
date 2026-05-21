const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload from buffer to cloudinary via upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: '3d-product-builder-logos' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Error:', error);
          return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
        }
        res.status(200).json({ url: result.secure_url });
      }
    );

    // End stream with buffer
    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
