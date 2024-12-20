const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('genre', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        genreName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
}