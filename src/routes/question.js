import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import QuestionController from '../components/questions/questionController';
import questionController from '../components/questions/questionController';

const questionRouter = Router();

questionRouter.post('/getQuestion', checkAuth, QuestionController.getQuestion);
questionRouter.post('/getQuestion/:child', checkAuth, QuestionController.getChildQuestion);
questionRouter.get('/all', QuestionController.allQuestions);

//Create Questions
questionRouter.post('/createQuestion', QuestionController.createQuestion);

//update Questions
questionRouter.patch('/updateQuestion/:questionId', QuestionController.updateQuestion);

questionRouter.delete('/delete/:id', questionController.deleteQuestion);


module.exports = questionRouter;