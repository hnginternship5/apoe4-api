import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import Category from '../components/category/categoryController';

const categoryRouter = Router();

categoryRouter.post('/create', checkAuth, Category.create);
categoryRouter.get('/', Category.all);
categoryRouter.put('/modify', Category.modify);


module.exports = categoryRouter;