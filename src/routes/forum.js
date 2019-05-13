import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import forumController from '../components/forum/forumController';

const forumRouter = Router();

// Create thread
forumRouter.post('/create', checkAuth, forumController.validateCreate, forumController.create);
forumRouter.get('/:category', checkAuth, forumController.categoryThread);

// get all available categories
// forumRouter.get('/category', checkAuth, forumController.allCategory);


module.exports = forumRouter;