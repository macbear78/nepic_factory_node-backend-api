import { Router } from 'express';
import * as noticeController from '../controllers/notice.controller.js';

const router = Router();

router.get('/', noticeController.list);
router.get('/:id', noticeController.getOne);
router.post('/', noticeController.create);
router.put('/:id', noticeController.update);
router.delete('/:id', noticeController.remove);

export default router;
