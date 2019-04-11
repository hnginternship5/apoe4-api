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
     * @apiName user/:userId
     * @apiVersion 1.0.0
     * @apiGroup User
     *
     *
     * @apiSuccess {Object} data userdetails.
     *
     * @apiSuccessExample Success-Response:
     *   HTTP/1.1 200 OK
     *  {
     *     "status": "success",
     *      "message": "User retrieved successfully.",
     *       "code": 200,
     *       "data": {
     *           "active": true,
     *           "isVerified": false,
     *           "_id": "5cacc39d97273e4d779d8310",
     *           "email": "johndoe@example.com",
     *           "firstName": "John",
     *           "lastName": "doe",
     *           "updatedAt": "2019-04-09T16:09:01.969Z",
     *           "createdAt": "2019-04-09T16:09:01.969Z",
     *           "__v": 0
     *  }
     * @apiparam {String} userId User's Id
     */

    async getUserProfile(req, res, next) {
        let user = await User.findOne({
            _id: req.params.userId
        }, '-password -customType');
        if (!user) {
            res.status(httpErrorCodes.BAD_REQUEST)
                .json(JsendSerializer.fail('User not found', req.params._id, httpErrorCodes.NOT_FOUND));
            return;
        } else {
            res.status(httpErrorCodes.OK).json(JsendSerializer.success('User retrieved successfully.', user));
        }
    }



    async updateUserProfile(req, res, next) {
        let user = await User.findOne({
            _id: req.params.userId
        });
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