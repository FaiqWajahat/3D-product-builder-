const Design = require('../models/Design');

const createDesign = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const design = await Design.create({ ...req.body, userId });
    res.status(201).json(design);
  } catch (error) {
    next(error);
  }
};

const getUserDesigns = async (req, res, next) => {
  try {
    const designs = await Design.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (error) {
    next(error);
  }
};

const getSingleDesign = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id).populate('productId', 'name category modelFilePath');
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.status(200).json(design);
  } catch (error) {
    next(error);
  }
};

const updateDesign = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this design' });
    }

    Object.assign(design, req.body);
    design.updatedAt = Date.now();
    await design.save();

    res.status(200).json(design);
  } catch (error) {
    next(error);
  }
};

const deleteDesign = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    if (design.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this design' });
    }

    await design.deleteOne();
    res.status(200).json({ message: 'Design deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDesign,
  getUserDesigns,
  getSingleDesign,
  updateDesign,
  deleteDesign,
};
