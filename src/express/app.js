const express = require('express');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middlewares/auth.middleware');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const routes = {
	auth: require('./routes/auth'),
	users: require('./routes/users'),
	movies: require('./routes/movies'),
	genres: require('./routes/genres'),
	logs: require('./routes/logs'),
	watchlists: require('./routes/watchlists'),
};

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

function makeHandlerAwareOfAsyncErrors(handler) {
	return async function (req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getAll) {
		app.get(
			`/api/${routeName}`,
			authenticateToken,
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	}
	if (routeController.getById) {
		app.get(
			`/api/${routeName}/:id`,
			authenticateToken,
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	}
	if (routeController.create) {
        const middlewares = routeName === 'users' ? [] : [authenticateToken];
		app.post(
			`/api/${routeName}`,
			...middlewares,
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}
	if (routeController.update) {
		app.put(
			`/api/${routeName}/:id`,
			authenticateToken,
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/api/${routeName}/:id`,
			authenticateToken,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
}

if (routes.watchlists.addMovie) {
	app.post(
		`/api/watchlists/:id/movies`,
		authenticateToken,
		makeHandlerAwareOfAsyncErrors(routes.watchlists.addMovie)
	);
}
if (routes.watchlists.listMovies) {
	app.get(
		`/api/watchlists/:id/movies`,
		authenticateToken,
		makeHandlerAwareOfAsyncErrors(routes.watchlists.listMovies)
	);
}

module.exports = app;