import Category from './categoryModel';
import AppError from '../../handlers/AppError';
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
/**
 * @module categoryController
 */

class categoryController {
    //constructor() {
      //  this.getUserProfile = this.getUserProfile.bind(this);
    //}

    /**
     * @api {post} /forum/category create category for forum
     * @apiName forum/category
     * @apiVersion 1.0.0
     * @apiGroup Forum
     *
     *
     * @apiSuccess {Object} data userdetails.
     *
     * @apiSuccessExample Success-Response:
     *   HTTP/1.1 200 OK
     *  {
     *     "status": "success",
     *      "message": "User retrieved successfully.",
     *       "code": 200,
     *       "data": {
     *           "active": true,
     *           "isVerified": false,
     *           "_id": "5cacc39d97273e4d779d8310",
     *           "email": "johndoe@example.com",
     *           "firstName": "John",
     *           "lastName": "doe",
     *           "updatedAt": "2019-04-09T16:09:01.969Z",
     *           "createdAt": "2019-04-09T16:09:01.969Z",
     *           "__v": 0
     *  }
     * @apiparam {String} userId User's Id
     */

    async createCategory(req, res, next) {
        const category = await Category.findOne({
            title: req.body.title,
        });
        if (category) {
            return res.status(httpErrorCodes.BAD_REQUEST)
                .json(JsendSerializer.fail('category already exists', req.body.title, httpErrorCodes.NOT_FOUND));
        } 

        const newCategory = new  Category({
            title: req.body.title,
            description: req.body.description,
        })
        try {
            await newCategory.save();
        }catch(e) {
            return next(
                new AppError(e.message || 'An error occured creating category', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
            );
        }

        return res.json({
                message: 'Category created'
            });

    }



    async allCategory(req, res, next) {
        let category = await Category.find();
        if (!category) {
            res.status(httpErrorCodes.OK)
                .json(JsendSerializer.success('no category available yet', null, httpErrorCodes.OK));
            return;
        }

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('categories available', category));
                
    };

    validateCreate(req, res, next) {
        req.sanitizeBody("title");
        req.sanitizeBody("description");
        req.checkBody("title", "title cannot be blank")
            .trim()
            .notEmpty();
        req.checkBody("description", "description cannot be blank")
            .trim()
            .notEmpty();

        const errors = req.validationErrors();

        if (errors) {
            const errorResponse = JsendSerializer
                .fail('Validation error', errors, httpErrorCodes.BAD_REQUEST);
            return res.status(httpErrorCodes.BAD_REQUEST).json(errorResponse);
        }
        next();
    }


}

export default new categoryController();
