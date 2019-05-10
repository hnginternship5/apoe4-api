import AnswerModel from "./answerModel";
import ScoreLogModel from "../scoreLogs/scoreLogModel";
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import scoreLogModel from "../scoreLogs/scoreLogModel";

class AnswerController {
    /**
     * @api {post} /answers/ Create an Answer
     * @apiName answers/
     * @apiVersion 1.0.0
     * @apiGroup Answers
     *
     *
     * @apiSuccess {String} Response Answers registered successfully!
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} question Question ID to assign relationship and link to its answer
     * @apiparam {String} owner Generated from Auth Token in Authorization Header
     * @apiparam {String} text The selected option from the user
     * @apiparam {String} created Generated by Server
     */


    async createAnswer(req, res, next) {
        try {
            const Answer = await AnswerModel.Answer.create(req.body);
            const newDate = new Date();
            newDate.setHours(4, 0, 0, 0);
            req.body.created = newDate;
            scoreLogModel.ScoreLog.findOne({
                created: newDate
            }, async function(err, scoreLog) {
                if (err) {
                    return res.status(500).json(err);
                } else {
                    if (scoreLog) {
                        console.log("Score Log Found");
                        scoreLog.answers.push(Answer.id);
                        scoreLog.save(function(err, response) {
                            if (err) {
                                Answer.delete();
                                console.log(err);
                                return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('Failed to Insert Answer to Score Log', err, 500));
                            } else {
                                return res.status(200).json(JsendSerializer.success('ScoreLog Updated!', 201));
                            }
                        });
                    } else {
                        try {
                            req.body.answers = [Answer.id];
                            const newLog = await ScoreLogModel.ScoreLog.create(req.body);
                            return res.status(200).json(JsendSerializer.success('ScoreLog created!', newLog, 201));
                        } catch (err) {
                            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('Failed to Create Score Log', err, 500));
                        }
                    }
                }
            });
            // return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Answer created!', Answer, 201));
        } catch (err) {
            console.log(err);
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }
}
export default new AnswerController();