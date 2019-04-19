import MailModel from './mailModel'
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';

class MailController {
    /**
     * @api {post} /mails/contact-form Send a contact request form
     * @apiName mails/
     * @apiVersion 1.0.0
     * @apiGroup Mails
     *
     *
     * @apiSuccess {String} Contact Request was Successful!
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} name Name of the person who wants to be contacted
     * @apiparam {String} email Email of the person who wants to be contacted
     * @apiparam {String} message Message of the person who is sending the request.
     */


    async contactForm(req,res){
        try{
            MailModel.validate(req.body)
            const contactMail = new MailModel(req.body);
            contactMail.sendEmail(contactMail.email,"Contact Request Form","contact-form");
            return res.status(200).json(contactMail)
        }
        catch(err){
            return res.status(httpErrorCodes.BAD_REQUEST).json({"err":err});
        }
    }

    async subscribeChimp(req,res){
        // TODO: waiting for mailchimp instructions
        return res.status(httpErrorCodes.BAD_REQUEST).json({"error":"This route is still incomplete"});
    }
}
export default new MailController();
