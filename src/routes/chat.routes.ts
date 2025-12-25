import { Router } from 'express';
import { ChatController } from '../controller/chat.controller';

const router = Router();

// POST /api/chat/query
router.post('/chat/query', ChatController.query);

// Health check for chat service
router.get('/health', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'Chat service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
