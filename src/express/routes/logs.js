const express = require('express');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const router = express.Router();

router.get('/getLogs', async (req, res) => {
    const userId = req.user.id;
    const logs = await models.log.findAll({
        where: {userId},
        include: [
            {model: models.user, as: 'user', attributes: ['id', 'username']},
            {model: models.movie, as: 'movie', attributes: ['id', 'title']}
        ]
    });
    res.status(200).json(logs);
});

router.get('/getLog/:id', async (req, res) => {
    const id = getIdParam(req);
    const userId = req.user.id;
    const log = await models.log.findOne({
        where: {id, userId},
        include: [
            { model: models.user, as: 'user', attributes: ['id', 'username'] },
            { model: models.movie, as: 'movie', attributes: ['id', 'title'] }
        ]
    });
    if (log) {
        res.status(200).json(log);
    } else {
        res.status(404).send('No se encontró la reseña.');
    }
});

router.post('/newLog', async (req, res) => {
    const {userId, movieId, review, rating} = req.body;
    if (req.body.id) {
        res.status(400).send('Solicitud incorrecta: no proporcione un ID, la base de datos lo determinará automáticamente.');
    } else {
        await models.log.create({userId, movieId, review, rating});
        res.status(201).end();
    }
});

router.put('/updateLog/:id', async (req, res) => {
    const id = getIdParam(req);
    if (req.body.id === id) {
        await models.log.update(req.body, {where: {id}});
        res.status(200).end();
    } else {
        res.status(400).send('Solicitud incorrecta: el ID del parámetro no coincide con el ID del log.');
    }
});

router.delete('/deleteLog/:id', async (req, res) => {
    const id = getIdParam(req);
    await models.log.destroy({where: {id}});
    res.status(200).end();
});

module.exports = router;