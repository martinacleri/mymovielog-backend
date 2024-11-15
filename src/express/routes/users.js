const express = require('express');
const { models } = require('../../sequelize');
const { getIdParam } = require('../helpers');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/getUsers', async (req, res) => {
    const users = await models.user.findAll();
    res.status(200).json(users);
});

router.get('/getUser/:id', async (req, res) => {
    const id = getIdParam(req);
    const user = await models.user.findByPk(id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'No se encontró el usuario.' });
    }
});

router.post('/newUser', async (req, res) => {
    const email = req.body.email;
    const existingUser = await models.user.findOne({where: {email}});
    if (existingUser) {
        return res.status(400).json({error: 'El email ya está registrado.'})
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await models.user.create({
        ...req.body,
        password: hashedPassword
    });
    res.status(201).end();
});

router.put('/updateUser/:id', async (req, res) => {
    const id = getIdParam(req);
    if (req.body.id === id) {
        await models.user.update(req.body, {where: {id}});
        res.status(200).end();
    } else {
        res.status(400).send('Solicitud incorrecta: el ID del parámetro no coincide con el ID del usuario.');
    }
});

router.delete('/deleteUser/:id', async (req, res) => {
    const id = getIdParam(req);
    await models.user.destroy({where: {id}});
    res.status(200).end();
});

module.exports = router;