import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import QuestionController from '../components/questions/questionController';

const questionRouter = Router();

questionRouter.post('/getQuestion',checkAuth, QuestionController.getQuestion);
questionRouter.post('/getQuestion/:child',checkAuth, QuestionController.getChildQuestion)

//Create Questions
questionRouter.post('/createQuestion',checkAuth, QuestionController.createQuestion);



module.exports = questionRouter;