const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email_verification_token: {
    type: DataTypes.STRING, // Store the 6-digit code
    allowNull: true,
  },
  email_verified_at: {
    type: DataTypes.DATE, // Store the time of verification
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    defaultValue: 'user',
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  paranoid: true, // enables soft delete (deletedAt)
  tableName: 'users'
});

module.exports = User;
