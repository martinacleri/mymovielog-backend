const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('log', {
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
        },
        review: {
            type: DataTypes.TEXT,
        },
        rating: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 5
            }
        }
    });
}