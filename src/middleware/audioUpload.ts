import { Request, Response } from "express";
import multer from "multer";
import { speechToText, textToSpeech } from "../services/voiceService";
import { categorizeExpense } from "../services/nlpService";
import Expense from "../models/expense";
import Notification from "../models/notification";
import { translateText, detectLanguage } from "../services/transalationService";
import logger from "../utils/logger";

// ============================================
// MULTER CONFIGURATION FOR AUDIO UPLOADS
// ============================================
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/') || 
        file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files allowed'));
    }
  }
});

// Export middleware
export const audioUploadMiddleware = upload.single('audio');
