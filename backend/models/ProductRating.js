const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductRating = sequelize.define('ProductRating', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      }
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'product_ratings',
    timestamps: true,
  });

  return ProductRating;
};
