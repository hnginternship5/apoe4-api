const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.owner = decoded.id;
        console.log(req.owner)
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};