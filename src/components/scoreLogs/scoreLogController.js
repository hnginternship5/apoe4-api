import ScoreLogModel from "./questionModel";
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import answerModel from "../answers/answerModel";
import mongoose from "mongoose";

class ScoreLogController {
    /**
     * @api {post} /scoreLogs/getScoreLog Get a ScoreLog
     * @apiName scoreLogs/getScoreLog
     * @apiVersion 1.0.0
     * @apiGroup ScoreLogs
     *
     *
     * @apiSuccess {String} Response ScoreLog which hasnt been answere or message stating all scoreLogs answered
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} type Morning, Noon, Night, Register
     */


    async getScoreLog(req, res, next) {
    }

    /**
     * @api {post} /scoreLogs/createScoreLog Creating a question
     * @apiName scoreLogs/createScoreLog
     * @apiVersion 1.0.0
     * @apiGroup ScoreLogs
     *
     *
     * @apiSuccess {String} Response ScoreLogs Created.
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} text String of text to represent the question. e.g How was your day?
     * @apiparam {String} type Morning, Noon, Night, Register
     * @apiparam {Array} options Array of the User's Options
     
     */


    async createScoreLog(req, res, next) {
    }
}
export default new ScoreLogController();