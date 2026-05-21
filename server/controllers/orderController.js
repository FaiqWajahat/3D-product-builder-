const Order = require('../models/Order');
const Design = require('../models/Design');

const createOrder = async (req, res, next) => {
  try {
    const { designId, userDetails } = req.body;
    const userId = req.user._id;

    if (!designId || !userDetails || !userDetails.name || !userDetails.email || !userDetails.qty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify design exists and belongs to user
    const design = await Design.findById(designId);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    
    if (design.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Not authorized to order this design' });
    }

    const order = await Order.create({
      userId,
      designId,
      userDetails,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: 'designId',
        select: 'name colorZones logoUrl productId createdAt',
        populate: {
          path: 'productId',
          select: 'name category'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};
