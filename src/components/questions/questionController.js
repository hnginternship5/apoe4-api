import { registerQuestions, dailyQuestions } from './questionModel';
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';

/**
 * @api {post} /questions/register-question Questions after registeration
 * @apiName questions/register-question
 * @apiVersion 1.0.0
 * @apiGroup Questions
 *
 *
 * @apiSuccess {String} Response Questions registered successfully!
 *
 *
 * @apiError {String} Response An internal Server error has occured!
 *
 *
 * @apiparam {Boolean} familyHistory if User's family has history of Alzheimer's
 * @apiparam {String} dailyActivities User's frequent activities daily
 * @apiparam {Boolean} familiar if user is familiar with Alzheimer's
 * @apiparam {String} variant user's gene variant
 * @apiparam {Boolean} test if user would like suggestions on where to take tests
 * @apiparam {Boolean} highBloodPressure if user has a high blood pressure
 * @apiparam {Date} lastCheckup user's last checkup date
 */

class QuestionController {
    async registerQuestions(req, res, next) {
        try {
            const newQuestion = await registerQuestions.create(req.body);
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions registered successfully!', newQuestion, 201));

        } catch (err) {
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    /**
     * @api {post} /questions/daily-question Daily Questions
     * @apiName questions/daily-question
     * @apiVersion 1.0.0
     * @apiGroup Questions
     *
     *
     * @apiSuccess {String} Response Questions registered successfully!
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} day How was the user's day
     * @apiparam {String} night How was the user's night
     * @apiparam {String} plannedActivities User's planned activities for the day
     * @apiparam {Boolean} reminders if user wants to set any reminders for the day
     */

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