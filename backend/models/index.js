const sequelize = require('../configs/db');
const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const SupportTicket = require('./SupportTicket');
const ProductMedia = require('./ProductMedia')(sequelize);
const Wishlist = require('./Wishlist')(sequelize);
const ProductRating = require('./ProductRating')(sequelize);
const CartItem = require('./CartItem')(sequelize);

// Associations
Product.hasMany(ProductMedia, { foreignKey: 'product_id', as: 'media', onDelete: 'CASCADE' });
ProductMedia.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });

// Wishlist
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlist', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlisted_by', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });

// ProductRating
User.hasMany(ProductRating, { foreignKey: 'user_id', as: 'ratings', onDelete: 'CASCADE' });
ProductRating.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(ProductRating, { foreignKey: 'product_id', as: 'ratings', onDelete: 'CASCADE' });
ProductRating.belongsTo(Product, { foreignKey: 'product_id' });

// CartItem
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cart', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'in_carts', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// Sync all models
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // alter: true will modify tables to fit models without dropping them completely
    // await sequelize.sync({ alter: true });
    // console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Address,
  Category,
  Product,
  Order,
  OrderItem,
  SupportTicket,
  ProductMedia,
  ProductVariant,
  Wishlist,
  ProductRating,
  CartItem,
  syncDatabase
};
