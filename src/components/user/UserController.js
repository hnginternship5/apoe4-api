import User from '../user/userModel';
//import httpErrorCodes from '../../util/httpErrorCodes';

class UserController {

    constructor() {
        this.getUser = this.getUser.bind(this);
        this.getUserAnswer = this.getUserAnswer.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

     getUser = (req, res) => {
        const {useremail} = req.params;
        let userDetails = User.findOne(useremail);
        if(!userDetails){
            res.status(404);
        }else {
            res.status(200).send({details:userDetails});
        }
    }


}