import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../Controllers/categoryController.js';
import { upload } from '../Middleware/multer.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', upload.single('image'), createCategory);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
