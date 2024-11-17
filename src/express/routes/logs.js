const express = require('express');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const router = express.Router();

router.get('/getLogs', async (req, res) => {
    const userId = req.user.id;
    const logs = await models.user.findOne({
        where: {id: userId},
        include: [
            {
                model: models.movie,
                as: 'loggedMovies',
                through: {
                    attributes: ['review', 'rating'],
                },
                attributes: ['id', 'title', 'releaseDate', 'poster', 'synopsis'],
            },
        ],
        attributes: [],
    });
    console.log(JSON.stringify(logs, null, 2));
    res.status(200).json(logs.loggedMovies);
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

router.put('/updateLog/:id', async (req, res) => {
    const id = getIdParam(req);
    if (req.body.id === id) {
        await models.log.update(req.body, {where: {id}});
        res.status(200).end();
    } else {
        res.status(400).send('Solicitud incorrecta: el ID del parámetro no coincide con el ID del log.');
    }
});

router.delete('/deleteLog/:logId', async (req, res) => {
    const userId = req.user.id;
    const {logId} = req.params;

    const log = await models.log.findOne({where: {id: logId, userId}});
    if (!log) {
        return res.status(404).json({error: 'Log no encontrado o no autorizado.'});
    }
    await log.destroy();
    return res.status(200).json({message: 'Log eliminado con éxito.'});
});

module.exports = router;