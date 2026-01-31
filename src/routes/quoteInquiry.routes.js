import { Router } from 'express';
import * as quoteInquiryController from '../controllers/quoteInquiry.controller.js';

const router = Router();

router.get('/', quoteInquiryController.list);
router.get('/:id', quoteInquiryController.getOne);
router.post('/', quoteInquiryController.create);
router.put('/:id', quoteInquiryController.update);
router.delete('/:id', quoteInquiryController.remove);

export default router;
