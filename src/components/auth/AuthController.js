import jwt from 'jsonwebtoken';
import httpErrorCodes from '../../util/httpErrorCodes';
import JsendSerializer from '../../util/JsendSerializer';
import AppError from '../../handlers/AppError';
import passport from '../../config/passport';
import { User, Dob, Whg } from '../user/userModel';


/**
 * @module AuthController
 */
class AuthController {
    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * @api {post} /auth/register Register a user
     * @apiName auth/register
     * @apiVersion 1.0.0
     * @apiGroup Auth
     *
     *
     * @apiSuccess {String} accessToken User access token.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "accessToken": "oqueoqiniodq...",
     *     }
     *
     * @apiError ValidationError For Invalid data.
     *
     * @apiErrorExample ValidationError-Response:
     *      HTTP/1.1 400 OK
     *     {
     *       "status": "error",
     *        "message": "...",
     *         "data": []
     *     }
     *
     * @apiparam {String} firstName User's First name
     * @apiparam {String} lastName User's lastname
     * @apiparam {String} email user's email
     * @apiparam {String} password user's password
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
                accessToken: token,
            });
        });
    };

    /**
     * @api {post} /auth/login Login a user
     * @apiName auth/login
     * @apiVersion 1.0.0
     * @apiGroup Auth
     *
     *
     * @apiSuccess {String} accessToken User access token.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "accessToken": "oqueoqiniodq...",
     *        "userId": "ueuoripio3oij5oj3o5jp3"
     *     }
     *
     * @apiError ValidationError for invalid input data
     * @apiError InvalidCredentials For wrong email or password.
     * @apiError UserNotFound For Invalid data.
     *
     * @apiErrorExample ValidationError-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "status": "error",
     *        "message": "You must provide email and password",
     *         ...
     *     }
     * @apiErrorExample InvalidCredentials-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "status": "error",
     *        "message": "Incorrect email or password.",
     *         ...
     *     }
     * @apiErrorExample UserNotFound-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "status": "error",
     *        "message": "User not found",
     *         ...
     *     }
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "status": "error",
     *        "message": "...",
     *         ...
     *     }
     *
     * @apiparam {String} email user email
     * @apiparam {String} password password
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
                if (err) return next(new AppError(err.message || 'An error occured login in user', httpErrorCodes.INTERNAL_SERVER_ERROR, true));
                if (!user) {
                    const errors = JsendSerializer
                        .error(info.message || 'User not found', httpErrorCodes.NOT_FOUND);

                    return res.status(httpErrorCodes.NOT_FOUND).json(errors);
                }

                req.login(
                    user, {
                        session: false,
                    },
                    (err) => {
                        if (err) {
                            const errors = JsendSerializer
                                .error('User not found', httpErrorCodes.INTERNAL_SERVER_ERROR);
                            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(errors);
                        }

                        const token = this.signToken(user._id);

                        res.json({
                            accessToken: token,
                            userId: user._id
                        });

                    },
                );
            },
        )(req, res);
    }

    /**
     * @api {post} /auth/google login a user with google
     * @apiName auth/google
     * @apiVersion 1.0.0
     * @apiGroup Auth
     *
     *
     * @apiSuccess {String} accessToken User access token.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "accessToken": "oqueoqiniodq...",
     *     }
     *
     * @apiError ValidationError For Invalid data.
     *
     * @apiErrorExample ValidationError-Response:
     *      HTTP/1.1 400 OK
     *     {
     *       "status": "error",
     *        "message": "...",
     *         "data": []
     *     }
     *
     * @apiparam {String} firstName User's First name
     * @apiparam {String} lastName User's lastname
     * @apiparam {String} email user's email
     * @apiparam {String} password user's password
     */

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

    validateRegister(req, res, next) {
        req.sanitizeBody("firstName");
        req.sanitizeBody("lastName");
        req.checkBody("firstName", "first name cannot be blank")
            .trim()
            .notEmpty();
        req.checkBody("lastName", "last name cannot be blank")
            .trim()
            .notEmpty();
        req.checkBody("email", "Email is not valid").isEmail();
        req.checkBody(
            "password",
            "Password must be at least 6 characters long"
        ).len({
            min: 6
        });
        req.sanitizeBody("email").normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false
        });

        const errors = req.validationErrors();

        if (errors) {
            const errorResponse = JsendSerializer
                .fail('Validation error', errors, httpErrorCodes.BAD_REQUEST);
            return res.status(httpErrorCodes.BAD_REQUEST).json(errorResponse);
        }
        next();
    }
}

export default new AuthController();