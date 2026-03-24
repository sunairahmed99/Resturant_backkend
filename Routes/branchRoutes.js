import express from 'express';
import { getBranches, createBranch, updateBranch, deleteBranch } from '../Controllers/branchController.js';
import { upload } from '../Middleware/multer.js';

const router = express.Router();

router.get('/', getBranches);
router.post('/', upload.single('image'), createBranch);
router.put('/:id', upload.single('image'), updateBranch);
router.delete('/:id', deleteBranch);

export default router;
