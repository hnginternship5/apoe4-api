import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import AnswerController from '../components/answers/answerController';

const answerRouter = Router();

//Create Answers
answerRouter.post('/:questionId', checkAuth, helpers.reassignOwner, AnswerController.createAnswer);



module.exports = answerRouter;