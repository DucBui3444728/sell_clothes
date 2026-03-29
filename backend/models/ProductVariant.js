const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const Product = require('./Product');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  attributes: {
    type: DataTypes.JSON, // e.g., {"Color": "Red", "Size": "M"}
    allowNull: false,
    defaultValue: {}
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'product_variants'
});

module.exports = ProductVariant;
