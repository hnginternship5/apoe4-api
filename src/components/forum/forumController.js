import Forum from './forumModel';
import Category from './categoryModel';
import Comment from './comments';
import AppError from '../../handlers/AppError';
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
/**
 * @module forumController
 */

class forumController {
    //constructor() {
      //  this.getUserProfile = this.getUserProfile.bind(this);
    //}

    /**
     * @api {post} /forum/create create thread in forum
     * @apiName forum/
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

    async create(req, res, next) {
        let category = await Category.findOne({
            title: req.body.category
        });
        if (!category) {
            res.status(httpErrorCodes.BAD_REQUEST)
                .json(JsendSerializer.success('category does not exist', null, httpErrorCodes.BAD_REQUEST));
            return;
        }

        const newForum = new Forum({
            title: req.body.title,
            body: req.body.body,
            catId: category._id,
            author: req.owner,
        });

        try {
            await newForum.save();
        }catch(e) {
            return next(
                new AppError(e.message || 'An error occured creating category', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
            );
        }

        return res.status(httpErrorCodes.CREATED).json({
                message: 'Thread created'
            });

    }



    async categoryThread(req, res, next) {
        let category = await Category.findOne({title: req.params.category});
        if (!category) {
            res.status(httpErrorCodes.OK)
                .json(JsendSerializer.success('category not available', null, httpErrorCodes.OK));
            return;
        }

        let thread = await Forum.find({catId: category._id}).populate('catId author', 'title firstName');

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('threads available', thread));
                
    };

    async getThread(req, res, next) {
        let category = await Category.findOne({title: req.params.category});
        if (!category) {
            res.status(httpErrorCodes.OK)
                .json(JsendSerializer.success('category not available', null, httpErrorCodes.OK));
            return;
        }

        // TODO: validate threadId
        let thread = await Forum.find({
            _id: req.params.threadId,
            catId: category._id}).populate('catId author', 'title firstName');
        let comments = await Comment.findOne({
            threadId: thread[0]._id
        }).populate('author','firstName');
        //comment = [1,2,3];
        console.log(thread[0]._id);

        const result = {
            thread,
            comments
        }

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('threads available', result));
                
    };

    async createComment(req, res, next) {
        // TODO: validate threadId
        let thread = await Forum.findOne({
            _id: req.body.threadId
        });

        // return res.json({thread});

        if (!thread) {
            res.status(httpErrorCodes.BAD_REQUEST)
                .json(JsendSerializer.success('thread does not exist', null, httpErrorCodes.BAD_REQUEST));
            return;
        }
        let comments = new Comment({
            comment: req.body.comment,
            threadId: thread._id,
            author: req.owner,
        });


        try {
            await comments.save();
        }catch(e) {
            return next(
                new AppError(e.message || 'An error occured creating comments', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
            );
        }

        const commentResult = await Comment.findOne({
            _id: comments._id,
        }).populate('author', 'firstName');

        return res.status(httpErrorCodes.CREATED).json(JsendSerializer.success('comment created', commentResult));
                
    };

    validateCreate(req, res, next) {
        req.sanitizeBody("title");
        req.sanitizeBody("body");
        req.sanitizeBody("category");
        req.checkBody("title", "title cannot be blank")
            .trim()
            .notEmpty();
        req.checkBody("body", "body cannot be blank")
            .trim()
            .notEmpty();
            req.checkBody("category", "category cannot be blank")
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


    validateComment(req, res, next) {
        req.sanitizeBody("comment");
        req.checkBody("comment", "comment cannot be blank")
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

export default new forumController();
