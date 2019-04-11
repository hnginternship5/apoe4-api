import { Router } from 'express';
import QuestionController from '../components/questions/questionController';

const questionRouter = Router();
//post questions after register
questionRouter.post('/register-question', QuestionController.registerQuestions);

 //post daily questions
questionRouter.post('/daily-question', QuestionController.dailyQuestions);

 module.exports = questionRouter;
