const express = require('express');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const router = express.Router();

router.get('/getGenres', async (req, res) => {
    const genres = await models.genre.findAll({
        attributes: ['id','genreName'],
    });

    if (!genres || genres.length === 0) {
        return res.status(200).json([]);
    }
    res.status(200).json(genres);
});

router.get('/getGenre/:id', async (req, res) => {
    const id = getIdParam(req);
    const genre = await models.genre.findByPk(id);
    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(404).json({ error: 'No se encontró el género.' });
    }
});

router.get('/getMoviesByGenre/:id/movies', async (req, res) => {
    const genreId = getIdParam(req);
    const genre = await models.genre.findByPk(genreId, {
        include: {
            model: models.movie,
            as: 'movies',
            attributes: ['id', 'title']
        }
    });
    if (genre) {
        res.status(200).json(genre.movies);
    } else {
        res.status(404).json({ error: 'No se encontró el género.' });
    }
});

module.exports = router;