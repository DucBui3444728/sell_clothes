const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attributes: {
    type: DataTypes.JSON, // Array of attribute definitions e.g., [{ name: 'Color', values: ['Red', 'Blue'] }]
    allowNull: true,
    defaultValue: []
  },
  colors: {
    type: DataTypes.JSON, // Array of hex codes
    allowNull: true,
    defaultValue: []
  },
  sizes: {
    type: DataTypes.JSON, // Array of sizes ['S', 'M', 'L']
    allowNull: true,
    defaultValue: []
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'products'
});

// Relationships
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

module.exports = Product;
