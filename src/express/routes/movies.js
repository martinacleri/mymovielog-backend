const express = require('express');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const router = express.Router();

router.get('/getMovies', async (req, res) => {
    const movies = await models.movie.findAll({
        include: [{
            model: models.genre,
            as: 'genres',
            attributes: ['id', 'name']
        }]
    });
    res.status(200).json(movies);
});

router.get('/getMovie/:id', async (req, res) => {
    const id = getIdParam(req);
    const movie = await models.movie.findByPk(id, {
        include: [{
            model: models.genre,
            as: 'genres',
            attributes: ['id', 'name']
        }]
    });
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({error: 'No se encontró la película.'});
    }
});

router.post('/addMovie', async (req, res) => {
    if (req.body.id) {
        res.status(400).send('Solicitud incorrecta: no proporcione un ID, la base de datos lo determinará automáticamente.');
    } else {
        const movieAdded = await models.movie.create(req.body);
        if (req.body-genreIds) {
            const genres = await models.genre.findAll({where: {id: req.body.genreIds}});
            await movieAdded.setGenres(genres);
        }
        res.status(201).end();
    }
});

router.put('/updateMovie/:id', async (req, res) => {
    const id = getIdParam(req);
    if (req.body.id === id) {
        await models.movie.update(req.body, {where: {id}});
        res.status(200).end();
    } else {
        res.status(400).send('Solicitud incorrecta: el ID del parámetro no coincide con el ID de la película.');
    }
});

router.delete('/deleteMovie/:id', async (req, res) => {
    const id = getIdParam(req);
    await models.movie.destroy({where: {id}});
    res.status(200).end();
});

router.post('/:movieId/addToWatchlist', async (req, res) => {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    const movieData = req.body.movie;

    let movie = await models.movie.findByPk(movieId);
    if (!movie) {
        movie = await models.movie.create({
            id: movieData.id,
            title: movieData.title,
            releaseDate: movieData.releaseDate,
            poster: movieData.poster,
            synopsis: movieData.synopsis,
        });

        if (movieData.genre_ids) {
            const genres = await models.genre.findAll({where: {id: movieData.genre_ids}});
            await movie.setGenres(genres);
        }
    }

    const [watchlistEntry, created] = await models.watchlist.findOrCreate({where: {userId, movieId}});

    if (!created) {
        return res.status(400).json({error: 'La película ya está en la watchlist.'});
    }

    res.status(201).json({message: 'Película agregada a Ver Más Tarde'});
});

router.post('/:movieId/addLog', async (req, res) => {
    const userId = req.user.id;
    const movieId = req.params.movieId;
    const {review, rating} = req.body;

    let movie = await models.movie.findByPk(movieId);
    if (!movie) {
        const movieData = req.body.movie;
        movie = await models.movie.create({
            id: movieData.id,
            title: movieData.title,
            releaseDate: movieData.releaseDate,
            poster: movieData.poster,
            synopsis: movieData.synopsis,
        });

        if (movieData.genre_ids) {
            const genres = await models.genre.findAll({where: {id: movieData.genre_ids}});
            await movie.setGenres(genres);
        }
    }

    const log = await models.log.create({userId, movieId, review, rating});

    res.status(201).json(log);
});

module.exports = router;