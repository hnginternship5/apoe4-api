import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import helpers from '../helpers';
import categoryController from '../components/forum/categoryController';

const categoryRouter = Router();

// Create categories

// TODO: catgories should be created by only admins 
categoryRouter.post('/category', checkAuth, categoryController.validateCreate, categoryController.createCategory);

// get all available categories
categoryRouter.get('/category', checkAuth, categoryController.allCategory);


module.exports = categoryRouter;