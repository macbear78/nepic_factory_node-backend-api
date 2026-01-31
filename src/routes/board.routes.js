import { Router } from 'express';
import * as boardController from '../controllers/board.controller.js';

const router = Router();

router.get('/', boardController.list);
router.get('/:id', boardController.getOne);
router.post('/', boardController.create);
router.put('/:id', boardController.update);
router.delete('/:id', boardController.remove);

export default router;
