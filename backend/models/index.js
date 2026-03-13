const sequelize = require('../configs/db');
const User = require('./User');
const Address = require('./Address');

// Sync all models
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // alter: true will modify tables to fit models without dropping them completely
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Address,
  syncDatabase
};
