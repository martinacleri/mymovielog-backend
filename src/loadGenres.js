const axios = require('axios');
const { models, sequelize } = require('./sequelize');

const TMDB_API_KEY = 'dedd52875c3bee8da75e4103c138ab51';

async function loadGenres() {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`);
    const genres = response.data.genres;
    for (const genre of genres) {
        await models.genre.findOrCreate({
            where: {id: genre.id},
            defaults: {genreName: genre.name}
            });
        }
    console.log('Géneros cargados exitosamente en la base de datos.');
    await sequelize.close();
}

loadGenres();