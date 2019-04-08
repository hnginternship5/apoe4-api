import jwt from 'jsonwebtoken';
import httpErrorCodes from '../../util/httpErrorCodes';
import JsendSerializer from '../../util/JsendSerializer';
import AppError from '../../handlers/AppError';
import passport from '../../config/passport';
import User from '../user/userModel';

/**
 * @module AuthController
 */
class AuthController {
    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }
    /**
     * Register User
     * @param {express.Request} req Request Object
     * @param {express.Response} res Reponse Object
     * @param {express.NextFunction} next NextFunction middleware
     */
    async register(req, res, next) {
        let existingUser = await User.findOne({
            email: req.body.email
        });
        if (existingUser) {
            res.status(httpErrorCodes.BAD_REQUEST)
                .json(JsendSerializer.fail('email already taken', req.body.email, httpErrorCodes.BAD_REQUEST));
            return;
        }

        const newUser = new User(req.body);

        newUser.save((err, user) => {
            if (err) {
                return next(
                    new AppError(err.message || 'An error occured creating user', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
                );
            }

            if (!user) {
                return next(new AppError('An error occured creating user', httpErrorCodes.INTERNAL_SERVER_ERROR, true));
            }

            const token = this.signToken(user._id);

            res.json({
                access_token: token,
            });
        });
    }

    /**
     * Log in User
     * @param {express.Request} req Request Object
     * @param {express.Response} res Reponse Object
     * @param {express.NextFunction} next NextFunction middleware
     */
    async login(req, res, next) {
        if (!req.body.email || !req.body.password) {
            const errors = JsendSerializer
                .fail('You must provide email and password', null, httpErrorCodes.BAD_REQUEST);
            res.status(httpErrorCodes.BAD_REQUEST).json(errors);
            return;
        }

        passport.authenticate(
            'local', {
                session: false,
            },
            (err, user, info) => {
                if (err) return next(new AppError(err.message || 'An error occured creating user', httpErrorCodes.INTERNAL_SERVER_ERROR, true));
                if (!user) {
                    const errors = JsendSerializer
                        .error(info.message || 'User not found', httpErrorCodes.NOT_FOUND);

                    return res.status(httpErrorCodes.NOT_FOUND).send(errors);
                }

                req.login(
                    user, {
                        session: false,
                    },
                    (err) => {
                        if (err) {
                            const errors = JsendSerializer
                                .error('User not found', httpErrorCodes.INTERNAL_SERVER_ERROR);
                            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).send(errors);
                        }

                        const token = this.signToken(user._id);

                        res.json({
                            access_token: token,
                        });

                    },
                );
            },
        )(req, res);
    }

    signToken(id) {
        return jwt.sign({
            id
        }, process.env.JWT_SECRET, {
            expiresIn: 86400 * 2, //48 hours, 2 days
        });
    }

    signRefreshToken(id) {
        return jwt.sign({
            id,
        }, process.env.JWT_SECRET, {
            expiresIn: 86400 * 14, //2 weeks
        });
    }
}

export default new AuthController();