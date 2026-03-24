import express from 'express';
import { getAreas, createArea, updateArea, deleteArea } from '../Controllers/areaController.js';

const router = express.Router();

router.get('/', getAreas);
router.post('/', createArea);
router.put('/:id', updateArea);
router.delete('/:id', deleteArea);

export default router;
