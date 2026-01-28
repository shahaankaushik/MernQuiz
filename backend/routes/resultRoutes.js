import express from 'express';
import { createResult, listResult } from '../controller/resultController.js';
import authMiddleware from '../middleware/auth.js';
const resultRouter = express.Router();

resultRouter.post('/', authMiddleware,createResult );
resultRouter.get('/', authMiddleware, listResult);

export default resultRouter;