import jwt from 'jsonwebtoken';
import JsendSerializer from '../util/JsendSerializer';
import httpErrorCodes from '../util/httpErrorCodes';

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.owner = decoded.id;
        return next();
    } catch (error) {
        return res.status(httpErrorCodes.UNAUTHORIZED).json(JsendSerializer.fail('Auth failed', error, 401));
    }
};

export default auth;
