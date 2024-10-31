const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const genres = await models.genre.findAll();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching genres', details: error.message });
    }
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const genre = await models.genre.findByPk(id);
        if (genre) {
            res.status(200).json(genre);
        } else {
            res.status(404).json({ error: 'Genre not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching genre', details: error.message });
    }
}

async function listMovies(req, res) {
    const genreId = getIdParam(req);
    try {
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
            res.status(404).json({ error: 'Genre not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies for genre', details: error.message });
    }
}

module.exports = {
    getAll,
    getById,
    listMovies,
};