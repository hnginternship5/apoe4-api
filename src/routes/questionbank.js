import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import QuestionBankController from '../components/questionBank/questionbankController';

const qbRouter = Router();

//Create Answers
qbRouter.post('/add-question', checkAuth, QuestionBankController.store);
qbRouter.get('/questions', checkAuth, QuestionBankController.all);
qbRouter.put('/update-question/:id', checkAuth, QuestionBankController.update);
qbRouter.get('/get-question/:id', checkAuth, QuestionBankController.read);
qbRouter.delete('/delete-question/:id', checkAuth, QuestionBankController.remove)


module.exports = qbRouter;