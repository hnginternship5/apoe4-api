import Forum from './forumModel';
import Comment from './comments';
import Like from './likes';
import { User } from '../user/userModel';
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


    async create(req, res, next) {
        const newForum = new Forum({
            title: req.body.title,
            body: req.body.post,
            author: req.owner,
        });

        try {
            await newForum.save();
        } catch (e) {
            return next(
                new AppError(e.message || 'An error occured creating category', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
            );
        }

        return res.status(httpErrorCodes.CREATED).json({
            message: 'Thread created'
        });

    }



    // TODO: add count for likes
    async allThread(req, res, next) {
        let thread = await Forum.find().populate('author', 'firstName');

        for (let i of Object.keys(thread)) {
            let commentCount = await Comment.countDocuments({ threadId: thread[i]._id });
            thread[i] = {...thread[i]._doc, commentCount };
        }

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('threads available', thread));

    };

    async getThread(req, res, next) {
        // TODO: validate threadId
        let thread = await Forum.find({
            _id: req.params.threadId,
        }).populate('author', 'firstName');

        let comments = await Comment.findOne({
            threadId: thread[0]._id
        }).populate('author', 'firstName');
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
            comment: req.body.post,
            threadId: thread._id,
            author: req.owner,
        });


        try {
            await comments.save();
        } catch (e) {
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
        req.sanitizeBody("post");
        req.checkBody("title", "title cannot be blank")
            .trim()
            .notEmpty();
        req.checkBody("post", "post cannot be blank")
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
        req.sanitizeBody("post");
        req.checkBody("post", "post cannot be blank")
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

    // TODO: implement notification for mention users
    getMentions(req, res, next) {
        return new Promise((resolve, reject) => {
            const regex = /@\w+/g;
            const arr = req.body.post.match(regex);
            arr.forEach(async data => {
                console.log(data);
                const temp = data.slice(1);
                const mention = await User.findOne({
                    'firstName': temp
                });

                arr.shift();

                if (mention) {
                    const regex = new RegExp(data, 'g');
                    req.body.post = req.body.post.replace(regex, `<a href="/users/${mention.id}">${temp}</a>`);
                }
            });

            setInterval(() => {
                if (arr.length == 0) resolve();
            }, 100);
        }).then(() => next());
    }


    async updateThread(req, res) {
        const { id, title, body } = req.body;

        let thread = await Forum.findOne({
            _id: id
        });

        if (!thread) {
            const errorResponse = JsendSerializer
                .error('Thread does not exist', httpErrorCodes.NOT_FOUND);
            return res.status(httpErrorCodes.NOT_FOUND).json(errorResponse)
        }

        if (thread && req.owner != thread.author._id) {
            const errorResponse = JsendSerializer
                .fail('Unauthorized', null, httpErrorCodes.UNAUTHORIZED);
            return res.status(httpErrorCodes.UNAUTHORIZED).json(errorResponse)
        }

        if (title) {
            thread.title = title;
        }
        if (body) {
            thread.body = body
        }

        await thread.save();
        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Thread updated', thread));
    }

    async modifyComment(req, res) {
        const { id, comment, threadId } = req.body;
        let commentForum = await Comment.findById(id);

        if (!commentForum) {
            const errorResponse = JsendSerializer
                .error('Comment does not exist', httpErrorCodes.NOT_FOUND);
            return res.status(httpErrorCodes.NOT_FOUND).json(errorResponse)
        }

        if (commentForum && commentForum.threadId != threadId) {
            const errorResponse = JsendSerializer
                .error('Thread does not exist', httpErrorCodes.NOT_FOUND);
            return res.status(httpErrorCodes.NOT_FOUND).json(errorResponse)
        }

        if (commentForum && req.owner != commentForum.author._id) {
            const errorResponse = JsendSerializer
                .fail('Unauthorized', null, httpErrorCodes.UNAUTHORIZED);
            return res.status(httpErrorCodes.UNAUTHORIZED).json(errorResponse)
        }

        if (comment) {
            commentForum.comment = comment;
        }

        await commentForum.save();
        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Comment modified', commentForum));
    }

    async deleteThread(req, res) {
        const { threadId } = req.params;

        let thread = await Forum.findById(threadId);

        if (!thread) {
            const errorResponse = JsendSerializer
                .error('Thread does not exist', httpErrorCodes.NOT_FOUND);
            return res.status(httpErrorCodes.NOT_FOUND).json(errorResponse)
        }

        if (thread && req.owner != thread.author._id) {
            const errorResponse = JsendSerializer
                .fail('Unauthorized', null, httpErrorCodes.UNAUTHORIZED);
            return res.status(httpErrorCodes.UNAUTHORIZED).json(errorResponse)
        }

        let comment = await Comment.findOne({
            threadId
        });

        if (comment) {
            const errorResponse = JsendSerializer
                .fail('Comment exists for this thread', null, httpErrorCodes.METHOD_NOT_ALLOWED);
            return res.status(httpErrorCodes.METHOD_NOT_ALLOWED).json(errorResponse)
        }

        await Forum.deleteOne({ _id: threadId });
        const forum = await Forum.find();
        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Thread has been deleted', forum));

    }

    async deleteComment(req, res) {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            const errorResponse = JsendSerializer
                .error('Comment does not exist', httpErrorCodes.NOT_FOUND);
            return res.status(httpErrorCodes.NOT_FOUND).json(errorResponse)
        }

        if (comment && req.owner != comment.author._id) {
            const errorResponse = JsendSerializer
                .fail('Unauthorized', null, httpErrorCodes.UNAUTHORIZED);
            return res.status(httpErrorCodes.UNAUTHORIZED).json(errorResponse)
        }

        let thread = comment.threadId;

        await Comment.deleteOne({ _id: commentId });
        const otherComments = await Comment.find({ threadId: thread });
        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Comment has been deleted', otherComments));

    }

    async likeThread(req, res) {
        const { threadId } = req.params;
        const Thread = await Forum.findById(threadId);

        if (!Thread) {
            const errorResponse = JsendSerializer
                .error('Thread does not exist', httpErrorCodes.NOT_FOUND);
            return res.status(httpErrorCodes.NOT_FOUND).json(errorResponse)
        }

        const checkLike = await Like.findOne({
            threadId,
            author: req.owner,
        });

        if (checkLike) {
            const errorResponse = JsendSerializer
                .error('You liked this thread already', httpErrorCodes.BAD_REQUEST);
            return res.status(httpErrorCodes.BAD_REQUEST).json(errorResponse)
        }

        const like = new Like({
            threadId,
            author: req.owner,
        });

        await like.save();

        const Response = JsendSerializer
                .error('Thread liked', httpErrorCodes.OK);
            return res.status(httpErrorCodes.OK).json(Response)
    }
}

export default new forumController();