const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    // Count existing products to see if we already have baseball/basketball seeded
    const count = await Product.countDocuments({ category: { $in: ['baseball', 'basketball'] } });
    if (count > 0) {
      console.log('Baseball and Basketball products already seeded.');
      return;
    }

    // Clear old products to ensure clean transition to new model structure
    await Product.deleteMany({});
    console.log('Cleared existing outdated products.');

    const products = [
      {
        name: 'Baseball Jersey',
        category: 'baseball',
        description: 'Classic button-down baseball jersey',
        modelFilePath: '/models/jersey.glb',
        colorZones: ['body', 'sleeves', 'collar'],
      },
      {
        name: 'Baseball Pants',
        category: 'baseball',
        description: 'Professional baseball pants with side piping',
        modelFilePath: '/models/t-shirt.glb',
        colorZones: ['body', 'piping', 'waistband'],
      },
      {
        name: 'Baseball Cap',
        category: 'baseball',
        description: 'Classic fit structured baseball cap',
        modelFilePath: '/models/cap.glb',
        colorZones: ['body', 'brim', 'button'],
      },
      {
        name: 'Basketball Jersey',
        category: 'basketball',
        description: 'Sleeveless game-day basketball jersey',
        modelFilePath: '/models/jersey.glb',
        colorZones: ['body', 'sleeves', 'collar'],
      },
      {
        name: 'Basketball Shorts',
        category: 'basketball',
        description: 'Comfortable athletic basketball shorts',
        modelFilePath: '/models/t-shirt.glb',
        colorZones: ['body', 'piping', 'waistband'],
      },
      {
        name: 'Basketball Hoodie',
        category: 'basketball',
        description: 'Over-the-head warmup basketball hoodie',
        modelFilePath: '/models/t-shirt.glb',
        colorZones: ['body', 'piping', 'waistband'],
      },
    ];

    await Product.insertMany(products);
    console.log('Seeded 6 sports templates successfully.');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = seedProducts;
