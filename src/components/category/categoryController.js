import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import Category from './categoryModel';

class CategoryController {

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
        const {category, child} = req.body;
        //let timeOfDay = new Date().getHours();

       const findCategory = await Category.findOne({category});

       if (findCategory) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category exists already!', findCategory, 400));
       }

       if (!category) {
           return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category is missing!', question, 400));
       }

       const newCategory = new Category();
       newCategory.category = category;
       if (child) {
           newCategory.child = child;
       }

       await newCategory.save();
       const categories = await Category.find({});
       return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category was created successfully!', categories, 201));
    }


    async modify(req, res){
        const {category, child} = req.body;
        const {id} = req.params;
        //let timeOfDay = new Date().getHours();

       const findCategory = await Category.findById(id);

       if (!findCategory) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category does not exist!', findCategory, 400));
       }

       if (category) {
            findCategory.category = category;
       }
       
       if (child) {
           findCategory.child = child;
       }

       await findCategory.save();
       const categories = await Category.find({});
       return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Category was created successfully!', categories, 201));
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
        const categories = await Category.find({});

        if (categories.count < 1) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.fail('No category has been created', null, 404));
        }

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Categories are:', categories, 201));
    }
}




export default new CategoryController();