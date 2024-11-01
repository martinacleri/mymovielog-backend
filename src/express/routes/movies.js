const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const { Op } = require('sequelize');

async function getAll(req, res) {
    try {
        const movies = await models.movie.findAll({
            include: [{
                model: models.genre,
                as: 'genres',
                attributes: ['id', 'name']
            }]
        });
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies', details: error.message });
    }
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
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
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movie', details: error.message });
    }
}

async function getPopular(req, res) {
    try {
        const popularMovies = await fetchPopularMoviesFromTMDB();
        if (popularMovies.length > 0) {
            res.status(200).json(popularMovies);
        } else {
            res.status(404).json({error: 'No popular movies found'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching popular movies', details: error.message });
    }
}

async function searchMoviesByName(req, res) {
    const { name } = req.query;
    try {
        const movies = await models.movie.findAll({
            where: { title: { [Op.iLike]: `%${name}%` } },
            include: [{ model: models.genre, as: 'genres' }]
        });
        if (movies.length > 0) {
            res.status(200).json(movies);
        } else {
            res.status(404).json({ error: 'No movies found with that name'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Error searching movies', details: error.message });
    }
}

async function create(req, res) {
    try {
        if (req.body.id) {
            return res.status(400).json({ error: 'ID should not be provided; it is generated by the database.' });
        }
        const newMovie = await models.movie.create(req.body);
        if (req.body-genreIds) {
            const genres = await models.genre.findAll({where: {id: req.body.genreIds}});
            await newMovie.setGenres(genres);
        }
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ error: 'Error creating movie', details: error.message });
    }
}

async function update(req, res) {
    const id = getIdParam(req);
    try {
        if (req.body.id === id) {
            const [updated] = await models.movie.update(req.body, { where: { id } });
            if (updated) {
                const updatedMovie = await models.movie.findByPk(id);
                if (req.body.genreIds) {
                    const genres = await models.genre.findAll({where: {id: req.body.genreIds}});
                    await updatedMovie.setGenres(genres);
                }
                res.status(200).json({ message: 'Movie updated successfully' });
            } else {
                res.status(404).json({ error: 'Movie not found' });
            }
        } else {
            res.status(400).json({ error: `Param ID (${id}) does not match body ID (${req.body.id}).` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating movie', details: error.message });
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    try {
        const deleted = await models.movie.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'Movie deleted successfully' });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting movie', details: error.message });
    }
}

module.exports = {
    getAll,
    getById,
    getPopular,
    searchMoviesByName,
    create,
    update,
    remove,
};