const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
}

module.exports = { authenticateToken };