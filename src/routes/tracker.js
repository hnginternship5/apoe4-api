import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import Tracker from '../components/tracker/trackerController';

const trackerRouter = Router();

trackerRouter.post('/select-date/:categoryId', checkAuth, Tracker.getADaySingleCategoryRating);
trackerRouter.post('/all-categories/select-date', checkAuth, Tracker.getADayAllCategoriesRatings);
trackerRouter.post('/all-date/:categoryId', checkAuth, Tracker.allSingleCategoryRatings);
trackerRouter.post('/all-categories/all-date', checkAuth, Tracker.allCategoriesRatings);


module.exports = trackerRouter;