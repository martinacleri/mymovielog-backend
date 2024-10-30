const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('watchlist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'movies',
                key: 'id'
            }
        }
    });
}