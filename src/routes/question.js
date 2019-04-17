import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import QuestionController from '../components/questions/questionController';

const questionRouter = Router();
//post questions after register
questionRouter.post('/register-question',checkAuth,helpers.reassignOwner, QuestionController.registerQuestions);

// //post daily questions
// questionRouter.post('/daily-question', QuestionController.dailyQuestions);

//post morning questions
questionRouter.post('/morning-question',checkAuth,helpers.reassignOwner, QuestionController.morningQuestions);

//post noon questions
questionRouter.post('/noon-question',checkAuth,helpers.reassignOwner, QuestionController.noonQuestions);

//post night questions
questionRouter.post('/night-question',checkAuth,helpers.reassignOwner, QuestionController.nightQuestions);


module.exports = questionRouter;