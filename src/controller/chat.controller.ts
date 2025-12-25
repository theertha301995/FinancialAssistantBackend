import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { ChatRequest } from '../types/chat.types';

export class ChatController {
  static async query(req: Request, res: Response): Promise<void> {
    try {
      const { message, userId, familyId } = req.body as ChatRequest;

      console.log('📨 Chat query received:', { message, userId, familyId });

      // Validation
      if (!message) {
        res.status(400).json({ 
          success: false,
          error: 'Message is required' 
        });
        return;
      }

      if (!userId || !familyId) {
        res.status(400).json({ 
          success: false,
          error: 'userId and familyId are required' 
        });
        return;
      }

      // Analyze intent
      const intent = ChatService.analyzeIntent(message);
      console.log('🤔 Detected intent:', intent.type);

      // Process intent and get response
      const response = await ChatService.processIntent(intent, userId, familyId);
      console.log('✅ Response generated:', response.type);

      // Send response
      res.json({
        success: true,
        ...response
      });

    } catch (error) {
      console.error('❌ Chat query error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to process your request',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

