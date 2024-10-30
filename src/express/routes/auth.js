const { models } = require('../../sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(user) {
    return jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await models.user.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
}

module.exports = { login };