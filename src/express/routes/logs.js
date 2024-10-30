const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
    try {
        const logs = await models.log.findAll({
            include: [
                {model: models.user, as: 'user', attributes: ['id', 'username']},
                {model: models.movie, as: 'movie', attributes: ['id', 'title']}
            ]
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching logs', details: error.message });
    }
}

async function getById(req, res) {
    const id = getIdParam(req);
    try {
        const log = await models.log.findByPk(id, {
            include: [
                { model: models.user, as: 'user', attributes: ['id', 'username'] },
                { model: models.movie, as: 'movie', attributes: ['id', 'title'] }
            ]
        });
        if (log) {
            res.status(200).json(log);
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching log', details: error.message });
    }
}

async function create(req, res) {
    const { userId, movieId, review, rating } = req.body;
    if (!userId || !movieId) {
        return res.status(400).json({ error: 'userId and movieId are required.' });
    }
    try {
        const newLog = await models.log.create({userId, movieId, review, rating});
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: 'Error creating log', details: error.message });
    }
}

async function update(req, res) {
    const id = getIdParam(req);
    try {
        if (req.body.id === id) {
            const [updated] = await models.log.update(req.body, {
                where: { id }
            });
            if (updated) {
                res.status(200).send('Log updated successfully');
            } else {
                res.status(404).send('404 - Not found');
            }
        } else {
            res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating log', details: error.message });
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    try {
        const deleted = await models.log.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(200).send('Log deleted successfully');
        } else {
            res.status(404).send('404 - Not found');
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting log', details: error.message });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};