import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import forumController from '../components/forum/forumController';

const forumRouter = Router();

// Create thread
forumRouter.post('/create', checkAuth, forumController.validateCreate, forumController.getMentions, forumController.create);
forumRouter.get('/:category', checkAuth, forumController.categoryThread);
forumRouter.get('/:category/:threadId', checkAuth, forumController.getThread);
forumRouter.post('/comment', checkAuth, forumController.validateComment, forumController.getMentions, forumController.createComment);

// get all available categories
// forumRouter.get('/category', checkAuth, forumController.allCategory);


module.exports = forumRouter;