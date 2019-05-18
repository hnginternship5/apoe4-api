import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import Options from '../components/options/optionsController';

const optionRouter = Router();

optionRouter.post('/create', checkAuth, Options.create);
optionRouter.get('/', Options.all);
optionRouter.put('/modify/:id', checkAuth, Options.modify);


module.exports = optionRouter;