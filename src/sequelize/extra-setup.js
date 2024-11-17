function applyExtraSetup(sequelize) {
    const {user, movie, log, genre, watchlist} = sequelize.models;

    user.belongsToMany(movie, {through: watchlist, as: 'watchlistMovies', foreignKey: 'userId', otherKey: 'movieId'});
    movie.belongsToMany(user, {through: watchlist, as: 'watchlistUsers', foreignKey: 'movieId', otherKey: 'userId'});

    user.belongsToMany(movie, {through: log, as: 'loggedMovies', foreignKey: 'userId', otherKey: 'movieId'});
    movie.belongsToMany(user, {through: log, as: 'loggedUsers', foreignKey: 'movieId', otherKey: 'userId'});

    movie.belongsToMany(genre, {through: 'moviegenre'});
    genre.belongsToMany(movie, {through: 'moviegenre'});

}

module.exports = {applyExtraSetup};