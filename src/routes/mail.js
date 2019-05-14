import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import MailController from '../components/mail/mailController';

const mailRouter = Router();

mailRouter.post('/contact-form', MailController.contactForm);

//Create Questions
mailRouter.post('/subscribe-chimp', MailController.subscribeChimp);



module.exports = mailRouter;