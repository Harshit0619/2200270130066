import express from 'express';
import { createShortUrl, redirectUrl, getStats } from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorturls', createShortUrl);  
router.get('/r/:code', redirectUrl);         
router.get('/stats/:code', getStats);        

export default router;
