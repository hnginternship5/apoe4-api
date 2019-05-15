import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import forumController from '../components/forum/forumController';

const forumRouter = Router();

// Create thread
forumRouter.post('/create', checkAuth, forumController.validateCreate, forumController.getMentions, forumController.create);
forumRouter.get('/', checkAuth, forumController.allThread);
forumRouter.get('/:threadId', checkAuth, forumController.getThread);
forumRouter.post('/comment', checkAuth, forumController.validateComment, forumController.getMentions, forumController.createComment);
forumRouter.put('/edit', checkAuth, forumController.updateThread);
forumRouter.put('/comment/modify', checkAuth, forumController.modifyComment);
forumRouter.delete('/:threadId', checkAuth, forumController.deleteThread);
forumRouter.delete('/comment/:commentId', checkAuth, forumController.deleteComment);
// get all available categories
// forumRouter.get('/category', checkAuth, forumController.allCategory);


module.exports = forumRouter;