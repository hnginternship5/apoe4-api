import { Router } from 'express';
import QuestionController from '../components/questions/questionController';

const questionRouter = Router();
//post questions after register
questionRouter.post('/register-question', QuestionController.registerQuestions);

// //post daily questions
// questionRouter.post('/daily-question', QuestionController.dailyQuestions);

//post morning questions
questionRouter.post('/morning-question', QuestionController.morningQuestions);

//post noon questions
questionRouter.post('/noon-question', QuestionController.noonQuestions);

//post night questions
questionRouter.post('/night-question', QuestionController.nightQuestions);


module.exports = questionRouter;