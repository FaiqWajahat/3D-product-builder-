const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// Setup multer memory storage (stores file buffer in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only .png and .jpg format allowed!'), false);
    }
  }
});

// Single file upload route expecting field name 'logo'
router.post('/', upload.single('logo'), uploadImage);

module.exports = router;
