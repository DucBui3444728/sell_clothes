const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductMedia = sequelize.define('ProductMedia', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('image', 'video'),
            defaultValue: 'image'
        },
        sort_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'product_media'
    });

    return ProductMedia;
};
