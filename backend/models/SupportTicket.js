const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');
const User = require('./User');

const SupportTicket = sequelize.define('SupportTicket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'resolved', 'closed'),
    allowNull: false,
    defaultValue: 'open'
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'support_tickets'
});

User.hasMany(SupportTicket, { foreignKey: 'user_id', as: 'tickets' });
SupportTicket.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = SupportTicket;
