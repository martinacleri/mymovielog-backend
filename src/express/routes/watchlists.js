const express = require('express');
const { models } = require('../../sequelize');
const router = express.Router();

router.get('/getWatchlist', async (req, res) => {
    const userId = req.user.id;
    const {genreId} = req.query;
    
    const whereClause = genreId ? {id: genreId} : {};

    const watchlist = await models.movie.findAll({
        include: [
            {
            model: models.user,
            as: 'watchlistUsers',
            through: {attributes: []},
            where: {id: userId},
            attributes: [],
            },
            {
                model: models.genre,
                attributes: ['id','genreName'],
                where: whereClause,
                through: {attributes: []},
            },
        ],
        attributes: ['id', 'title', 'releaseDate', 'poster', 'synopsis']
        });

    res.status(200).json(watchlist);
});

router.post('/addToWatchlist', async (req, res) => {
    const userId = req.user.id;
    const movieData = req.body.movie;

    console.log(movieData);
    console.log('Géneros proporcionados por TMDB:', movieData.genre_ids);

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

        if (movieData.genre_ids && movieData.genre_ids.length > 0) {
            const genres = await models.genre.findAll({where: {id: movieData.genre_ids}});
            console.log('Géneros encontrados:', genres.map(g => g.toJSON()));
            if (genres.length > 0) {
                await movie.setGenres(genres);
            }
        }
    }

    const associatedGenres = await movie.getGenres();
    console.log('Géneros asociados a la película:', associatedGenres.map(g => g.toJSON()));


    const user = await models.user.findByPk(userId);

    const existingMovies = await user.getMovies({where: {id: movieData.id}});
    if (existingMovies.length) {
        return res.status(400).json({message: 'La película ya está en la watchlist.'});
    }

    await user.addMovie(movie);
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