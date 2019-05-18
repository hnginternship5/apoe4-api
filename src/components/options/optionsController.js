import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import Option from './optionsModel';

class OptionController {

    /**
     * @api {post} /questions/getQuestion Get a Question
     * @apiName questions/getQuestion
     * @apiVersion 1.0.0
     * @apiGroup Questions
     *
     *
     * @apiSuccess {String} Response Question which hasn't been answered or message stating all questions answered
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} category Register, Daily, IADL.
     */


    async create(req, res) {
        const {option, score} = req.body;
        //let timeOfDay = new Date().getHours();

       const findOption = await Option.findOne({option});

       if (findOption) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Option exists already!', findOption, 400));
       }

       const newOption = new Option();
       newOption.option = option;
       newOption.score = score;

       await newOption.save();
       const options = await Option.find({});
       return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category was created successfully!', options, 201));
    }


    async modify(req, res){
        const {option, score} = req.body;
        const {id} = req.params;
        //let timeOfDay = new Date().getHours();

       const findOption = await Option.findById(id);

       if (!findOption) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Option does not exist!', findOption, 400));
       }

       if (option) {
            findOption.option = option;
       }
       
       if (score) {
           findOption.score = score;
       }

       await findOption.save();
       const options = await Option.find({});
       return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category was created successfully!', options, 201));
    }




    /**
     * @api {get} /questions/all Getting all questions
     * @apiName questions/all
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
     */

    //get all questions
    async all(req, res) {
        const options = await Option.find({});

        if (options.count < 1) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.fail('No option has been created', null, 404));
        }

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Options are:', options, 201));
    }
}




export default new OptionController();