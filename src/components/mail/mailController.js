import MailModel from './mailModel'
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import request from "request";

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
            contactMail.sendEmail("geneapoe@gmail.com","Contact Request Form","contact-form");
            contactMail.sendEmail(contactMail.email,"Contact Request","contact-form-response");
            return res.status(200).json(contactMail)
        }
        catch(err){
            return res.status(httpErrorCodes.BAD_REQUEST).json({"err":err});
        }
    }


    /**
     * @api {post} /mails/subscribe-chimp Subscribes the information to our mailchimp
     * @apiName mails/subscribe-chimp
     * @apiVersion 1.0.0
     * @apiGroup Mails
     *
     *
     * @apiSuccess {String} Success Response Message!
     *
     *
     * @apiError {String} Response A response of error code 400 from mailchimp servers!
     *
     *
     * @apiparam {String} email Email Address of the person wants to be contacted.
     */
    async subscribeChimp(req,res){

        console.log(req.body)

        var clientServerOptions = {
            uri: 'https://us20.api.mailchimp.com/3.0/lists/8b56cd60fd/members',
            body: JSON.stringify({
                    "email_address":req.body.email,
                    "status_if_new":"subscribed",
                    "status":"subscribed"
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'apikey 47116c36887736ffd3b771299319ac94-us20'
            }
        }
        request(clientServerOptions, function (err, response) {
            if  (err){
                return res.status(500).json({error:err})
            }
            else {
                if (response.statusCode===200){
                    return res.status(200).json(JSON.parse(response.body))
                }
                else {
                    res.status(400).json(JSON.parse(response.body))
                }
            }
        });
    }
}
export default new MailController();
