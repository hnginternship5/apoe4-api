import User from '../user/userModel';
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
                res.status(200).send({profile : user});
            }
    
           
    }

}
    
    export default new UserController();
