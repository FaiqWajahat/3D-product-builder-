const express = require('express');
const {
  createDesign,
  getUserDesigns,
  getSingleDesign,
  updateDesign,
  deleteDesign,
} = require('../controllers/designController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createDesign)
  .get(protect, getUserDesigns);

router.route('/:id')
  .get(getSingleDesign)
  .put(protect, updateDesign)
  .delete(protect, deleteDesign);

module.exports = router;
