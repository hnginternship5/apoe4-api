import User from '../user/userModel';
import JsendSerializer from '../../util/JsendSerializer';
/**
 * @module UserController
 */

class UserController {
    constructor() {
        this.getUserProfile = this.getUserProfile.bind(this);
    }

     /**
     * @api {get} /user/userDetails Get a user details
     * @apiName user/userDetails
     * @apiVersion 1.0.0
     * @apiGroup User
     *
     *
     * @apiSuccess {String} message userdetails.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message": "oqueoqiniodq...",
     *     }
     *
     * @apiparam {String} useremail User's Email
     */
    
    
    
        async getUserProfile(req, res, next) {
            let {useremail} = req.params;
            let user = await User.findOne(useremail);
            if (!user) {
                res.status(httpErrorCodes.BAD_REQUEST)
                    .json(JsendSerializer.fail('no user with the email', req.params.useremail, httpErrorCodes.BAD_REQUEST));
                return;
            }else {
                res.status(httpErrorCodes.OK).json(JsendSerializer.success('user profile',{profile : user}));
            }
    
           
    }

    /**
     * @api {get} /user/:userId/update Update a user details
     * @apiName user/update
     * @apiVersion 1.0.0
     * @apiGroup User
     *
     *
     * @apiSuccess {String} accesstoken token.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "accesstoken": "oqueoqiniodq...",
     *     }
     *
     * @apiparam {String} useremail User's Email
     * @apiparam {string} firstname User's firstname
     * @apiparam {string} lastname User's lastname
     * @apiparam {String} user_id User's id
     */

    async updateUserProfile(req, res, next) {
        let {user_id} = req.params;
        let user = await User.findOne(user_id);
        if (!user) {
            res.status(httpErrorCodes.BAD_REQUEST)
                .json(JsendSerializer.fail('cannot update profile cause no user found', req.params.useremail, httpErrorCodes.BAD_REQUEST));
            return;
        }

        const updatedUser = new User(req.body);

        updatedUser.save((err, user) => {
            if (err) {
                return next(
                    new AppError(err.message || 'An error occured updating profile', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
                );
            }

            if (!user) {
                return next(new AppError('An error occured updating profile', httpErrorCodes.INTERNAL_SERVER_ERROR, true));
            }

            const token = this.signToken(user._id);

            res.json({
                accessToken: token,
            });
        });
    };


}
    
    export default new UserController();