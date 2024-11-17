const express = require('express');
const { models } = require('../../sequelize');
const router = express.Router();

router.get('/getWatchlist', async (req, res) => {
    const userId = req.user.id;
    const watchlist = await models.movie.findAll({
        include: {
            model: models.user,
            as: 'watchlistUsers',
            through: {attributes: []},
            where: {id: userId},
            attributes: []
            },
            attributes: ['id', 'title', 'releaseDate', 'poster', 'synopsis']
        });
    if (watchlist.length === 0) {
        return res.status(404).json({message: 'No se encontraron películas para ver más tarde.'});
    }

    res.status(200).json(watchlist);
});

router.post('/addToWatchlist', async (req, res) => {
    const userId = req.user.id;
    const movieData = req.body.movie;

    console.log(movieData)

    if (!movieData || !movieData.id) {
        return res.status(400).json({error: 'Datos de la película inválidos.'});
    }

    let movie = await models.movie.findByPk(movieData.id);
    if (!movie) {
        movie = await models.movie.create({
            id: movieData.id,
            title: movieData.title,
            releaseDate: movieData.release_date,
            poster: movieData.poster_path,
            synopsis: movieData.overview,
        });

        if (movieData.genre_ids) {
            const genres = await models.genre.findAll({where: {id: movieData.genre_ids}});
            await movie.setGenres(genres);
        }
    }

    const watchlist = await models.watchlist.findOrCreate({ where: { userId } });

    console.log(watchlist);

    const existingMovies = await watchlist.getMovies({where: {id: movieData.id}});
    if (existingMovies.length) {
        return res.status(400).json({error: 'La película ya está en la watchlist.'});
    }

    await watchlist.addMovie(movie.od);
    res.status(201).json({message: 'Película agregada a Ver Más Tarde'});
});

router.delete('/removeFromWatchlist', async (req, res) => {
    const userId = req.user.id;
    const {movieId} = req.body;

    if (!movieId) {
        return res.status(400).json({error: 'Debe proporcionar el ID de la película.'});
    }

    const entry = await models.watchlist.findOne({
        where: {userId, movieId},
    });
    if (!entry) {
        return res.status(404).json({error: 'La película no está en ver más tarde.'});
    }
    
    await models.watchlist.destroy({
        where: {
            userId,
            movieId,
        },
    });
    return res.status(200).json({message: 'Película eliminada de ver más tarde con éxito.'});
});

module.exports = router;