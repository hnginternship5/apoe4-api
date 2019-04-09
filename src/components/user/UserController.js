import User from '../user/userModel';

class UserController {

    constructor() {
        this.getUserProfile = this.getUserProfile.bind(this);
        this.getUserAnswer = this.getUserAnswer.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

     getUserProfile = (req, res) => {
        const {useremail} = req.params;
        let userDetails = User.findOne(useremail);
        if(!userDetails){
            res.status(404);
        }else {
            res.status(200).send({details:userDetails});
        }
    }


}