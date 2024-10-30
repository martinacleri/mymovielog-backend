function applyExtraSetup(sequelize) {
    const {user, movie, log, genre, watchlist} = sequelize.models;

    user.belongsToMany(movie, {through: watchlist, foreignKey: 'userId', otherKey: 'movieId'});
    movie.belongsToMany(user, {through: watchlist, foreignKey: 'movieId', otherKey: 'userId'});

    user.belongsToMany(movie, {through: log, foreignKey: 'userId', otherKey: 'movieId'});
    movie.belongsToMany(user, {through: log, foreignKey: 'movieId', otherKey: 'userId'});

    movie.belongsToMany(genre, {through: 'moviegenre'});
    genre.belongsToMany(movie, {through: 'moviegenre'});

}

module.exports = {applyExtraSetup};