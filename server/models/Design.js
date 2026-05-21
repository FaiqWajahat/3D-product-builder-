const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    default: 'Untitled Design',
  },
  colorZones: {
    body: { type: String, default: '#ffffff' },
    sleeves: { type: String, default: '#ffffff' },
    collar: { type: String, default: '#ffffff' },
  },
  textConfig: {
    teamName: { type: String, default: '' },
    playerNumber: { type: String, default: '' },
    font: { type: String, default: 'Arial' },
    fontSize: { type: Number, default: 48 },
    color: { type: String, default: '#000000' },
    placement: { type: String, default: 'chest' },
  },
  logoUrl: {
    type: String,
    default: '',
  },
  logoPlacement: {
    type: String,
    default: 'chest',
  },
  patternId: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Design = mongoose.model('Design', designSchema);
module.exports = Design;
