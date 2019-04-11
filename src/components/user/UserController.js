import User from '../user/userModel';
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
/**
 * @module UserController
 */

class UserController {
    constructor() {
        this.getUserProfile = this.getUserProfile.bind(this);
    }

     /**
     * @api {get} /user/:userId Get a user details
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
            let user = await User.findOne({ _id: req.params.userId });
            if (!user) {
                res.status(httpErrorCodes.BAD_REQUEST)
                    .json(JsendSerializer.fail('User not found', req.params._id, httpErrorCodes.NOT_FOUND));
                return;
            }else {
                res.status(httpErrorCodes.OK).json(JsendSerializer.success('User retrieved successfully.', user));
            }
    }

    // /**
    //  * @api {get} /user/:userId/update Update a user details
    //  * @apiName user/update
    //  * @apiVersion 1.0.0
    //  * @apiGroup User
    //  *
    //  *
    //  * @apiSuccess {String} accesstoken token.
    //  *
    //  * @apiSuccessExample Success-Response:
    //  *     HTTP/1.1 200 OK
    //  *     {
    //  *       status: "success",
    //  *       data : {
    //  *              _id: ojqwoijroqpkodpowp,
    //  *              firstName: John
    //  *          }
    //  *     }
    //  *
    //  * @apiparam {String} useremail User's Email
    //  * @apiparam {string} firstname User's firstname
    //  * @apiparam {string} lastname User's lastname
    //  * @apiparam {String} user_id User's id
    //  */

    async updateUserProfile(req, res, next) {
        let user = await User.findOne({ _id: req.params.userId });
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
        });

        res.json({
            status: "error",
            "messsage": "Not implemented"
        })
    };


}

    export default new UserController();
