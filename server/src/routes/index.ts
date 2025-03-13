import express from 'express';
import CheckUrl from '../controller/urlController.js';

const router = express.Router();

router.post('/check-url', CheckUrl.checkUrl);

export default router;