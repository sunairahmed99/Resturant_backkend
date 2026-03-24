import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../Controllers/bannerController.js';
import { upload } from '../Middleware/multer.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/', upload.single('image'), createBanner);
router.put('/:id', upload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
