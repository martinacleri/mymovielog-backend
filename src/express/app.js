const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken } = require('./middlewares/auth.middleware');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const genreRoute = require('./routes/genres');
const logRoute = require('./routes/logs');
const watchlistRoute = require('./routes/watchlists');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', authenticateToken, movieRoute);
app.use('/api/genres', authenticateToken, genreRoute);
app.use('/api/logs', authenticateToken, logRoute);
app.use('/api/watchlists', authenticateToken, watchlistRoute);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send({error: 'Ocurrió un error en el servidor.'});
});

module.exports = app;