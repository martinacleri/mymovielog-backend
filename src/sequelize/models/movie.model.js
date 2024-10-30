const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('movie', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        releaseDate: {
            type: DataTypes.DATE,
        },
        poster: {
            type: DataTypes.STRING,
        },
        synopsis: {
            type: DataTypes.TEXT,
        }
    });
}