import { Router } from 'express';
import * as newsController from '../controllers/news.controller.js';
import { newsUpload } from '../config/multer.js';

const router = Router();

router.get('/', newsController.list);
router.get('/:id', newsController.getOne);
router.post('/', newsUpload, newsController.create);
router.put('/:id', newsUpload, newsController.update);
router.delete('/:id', newsController.remove);

export default router;
