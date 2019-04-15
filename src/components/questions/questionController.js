import { registerQuestions, dailyQuestions, morningQuestions, nightQuestions, noonQuestions } from './questionModel';
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';

class QuestionController {
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

    async registerQuestions(req, res, next) {
        try {
            const newQuestion = await registerQuestions.create(req.body);
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions registered successfully!', newQuestion, 201));

        } catch (err) {
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    /**
     * @api {post} /questions/morning-question Morning Questions
     * @apiName questions/morning-question
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
     * @apiparam {String} night How was the user's night: answers are great, good, fair, bad 
     * @apiparam {String} why if user's night was bad
     * @apiparam {String} plannedActivities User's planned activities for the day: walking, running, gym, none
     * @apiparam {String} reminders if user wants to set any reminders for the day: Yes, No
     */


    async morningQuestions(req, res, next) {
        try {
            const newMorningQuestion = await morningQuestions.create(req.body);
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Morning questions creatrd!', newMorningQuestion, 201));
        } catch (err) {
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    /**
     * @api {post} /questions/noon-question Noon Questions
     * @apiName questions/noon-question
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
     * @apiparam {String} now what the user is doing presently
     * @apiparam {String} where where the user is presently: At home, At work, working from home, other
     * @apiparam {String} day How the User's day is going: Awesome, interesting, boring, okay
     */

    async noonQuestions(req, res, next) {
        try {
            const newNoonQuestion = await noonQuestions.create(req.body);
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Noon questions creatrd!', newNoonQuestion, 201));
        } catch (err) {
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    /**
     * @api {post} /questions/night-question Night Questions
     * @apiName questions/night-question
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
     * @apiparam {String} excercise If the user did any excercise: answers are Yes, No 
     * @apiparam {String} day How was the user's day: great, good, fair, bad
     * @apiparam {String} Eaten How many times the user ate: 1, 2, 3, More
     */

    async nightQuestions(req, res, next) {
        try {
            const newNightQuestion = await nightQuestions.create(req.body);
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Evening questions creatrd!', newNightQuestion, 201));
        } catch (err) {
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }
}
export default new QuestionController();
