import { registerQuestions, dailyQuestions } from './questionModel';
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';

class QuestionController {
  async registerQuestions(req, res, next) {
    try{
      const newQuestion = await registerQuestions.create(req.body);      
      return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions registered successfully!', newQuestion, 201));
      
    }
    catch(err) {
      return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
    }
  }
  async dailyQuestions(req, res, next) {
    try {
      const newDailyQuestion = await dailyQuestions.create(req.body);
      return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Daily questions creatrd!', newDailyQuestion, 201));
    } catch (err) {
      return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
    }
  }
}
export default new QuestionController();
