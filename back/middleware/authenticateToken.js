const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401); // Token is required
    }

    console.log('Token provided:', token);

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] }, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.sendStatus(403); // Forbidden
        }
        console.log('Token verified, user:', user);
        req.user = user; // Attach user to request object
        next();
    });
};

module.exports = authenticateToken;
