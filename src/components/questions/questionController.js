import { registerQuestions, dailyQuestions } from './questionModel';

class QuestionController {
  async registerQuestions(req, res, next) {
    try{
      const newQuestion = await registerQuestions.create(req.body);      
      return res.status(201).json({
        question: newQuestion,
      });
      
    }
    catch(err) {
      return res.status(500).json({
        message: 'An internal server error has occured!',
        err,
      });
    }
  }
  async dailyQuestions(req, res, next) {
    try {
      const newDailyQuestion = await dailyQuestions.create(req.body);
      return res.status(201).json({
        dailyQuestion: newDailyQuestion,
      });
    } catch (err) {
      return res.status(500).json({
        message: 'An internal server error has occured!',
        err,
      });
    }
  }
}
export default new QuestionController();
