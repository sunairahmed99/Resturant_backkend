import express from 'express';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../Controllers/menuItemController.js';
import { upload } from '../Middleware/multer.js';

const router = express.Router();

router.get('/', getMenuItems);
router.post('/', upload.single('image'), createMenuItem);
router.put('/:id', upload.single('image'), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
