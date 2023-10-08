import express from 'express';
import { EnvironmentController } from '../controllers/environment.controller';

const router = express.Router({ mergeParams: true });
const controller = new EnvironmentController();

router.get('/', controller.getAll);
router.post('/', controller.createOne);
router.get('/:envId', controller.getOne);
router.put('/:envId', controller.updateOne);

export default router;
