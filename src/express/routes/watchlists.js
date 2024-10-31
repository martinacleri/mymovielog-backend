const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    const userId = req.user.id;
    try {
        const watchlist = await models.watchlist.findOne({ 
            where: { userId },
            include: {
                model: models.movie,
                as: 'movies',
                attributes: ['id', 'title']
            }
        });
        if (watchlist) {
            res.status(200).json(watchlist.movies);
        } else {
            res.status(404).json({ error: 'Watchlist not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching watchlist', details: error.message});
    }
}

async function addMovie(req, res) {
    const userId = req.user.id;
    const movieId = req.body.movieId;

    try {
        const watchlist = await models.watchlist.findOne({ where: { userId } });
        const movie = await models.movie.findByPk(movieId);

        if (!watchlist || !movie) {
        return res.status(404).json({ error: 'Watchlist or movie not found' });
    }

        const moviesInWatchlist = await watchlist.getMovies ({where: {id: movieId}});
        if (moviesInWatchlist.length) {
        return res.status(400).json({error: 'Movie already in watchlist'});
    }

    await watchlist.addMovie(movie);
    res.status(201).json({ message: 'Movie added to watchlist' });
    } catch (error) {
        res.status(500).json({error: 'Error adding movie to watchlist', details: error.message});
    }
}

async function listMovies(req, res) {
    const userId = req.user.id;
    try {
        const watchlist = await models.watchlist.findOne({
            where: { userId },
            include: {
                model: models.movie,
                as: 'movies',
                attributes: ['id', 'title']
            }
        });
        if (watchlist) {
            res.status(200).json(watchlist.movies);
        } else {
            res.status(404).json({ error: 'Watchlist not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies in watchlist', details: error.message });
    }
}

async function remove(req, res) {
    const userId = req.user.id;
    const movieId = req.body.movieId;

    try {
        const watchlist = await models.watchlist.findOne({ where: { userId } });
        if (!watchlist) {
            return res.status(404).json({ error: 'Watchlist not found' });
        }

        const moviesInWatchlist = await watchlist.getMovies({ where: { id: movieId } });
        if (!moviesInWatchlist.length) {
            return res.status(400).json({ error: 'Movie not found in watchlist' });
        }

        await watchlist.removeMovie(moviesInWatchlist[0]);
        res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing movie from watchlist', details: error.message });
    }
}

module.exports = {
    getAll,
    addMovie,
    listMovies,
    remove,
};