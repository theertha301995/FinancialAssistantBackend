// File: src/services/aiExpenseService.ts

import { detectLanguage } from "./transalationService";

// ============================================
// AI CHAT EXPENSE SERVICE
// Uses pattern matching to parse natural language expenses
// ============================================

interface ExpenseData {
  amount: number;
  category: string;
  description: string;
  confidence: number;
  needsClarification: boolean;
  clarificationQuestion?: string;
}

/**
 * Parse natural language text into expense data using pattern matching
 * Examples:
 * - "I spent 200 rupees on groceries"
 * - "500 രൂപ ഭക്ഷണത്തിന്"
 * - "Bought a dress for 1500"
 */
export const parseExpenseWithAI = async (
  text: string
): Promise<ExpenseData> => {
  console.log("🔍 Parsing expense:", text);

  try {
    // Extract amount (supports various formats)
    const amountMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:rupees?|₹|rs\.?|രൂപ)?/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;

    // Category keywords mapping
    const categoryKeywords: Record<string, string[]> = {
      Food: ['food', 'groceries', 'restaurant', 'dinner', 'lunch', 'breakfast', 'ഭക്ഷണ', 'grocery'],
      Transport: ['transport', 'taxi', 'bus', 'uber', 'petrol', 'fuel', 'യാത്ര'],
      Shopping: ['shopping', 'dress', 'clothes', 'shirt', 'shoes', 'bought', 'ഷോപ്പിംഗ്'],
      Entertainment: ['movie', 'entertainment', 'game', 'fun', 'സിനിമ'],
      Health: ['medicine', 'doctor', 'hospital', 'pharmacy', 'ആരോഗ്യ'],
      Bills: ['bill', 'electricity', 'water', 'internet', 'rent', 'ബിൽ'],
    };

    // Detect category
    let category = 'Other';
    let maxMatches = 0;
    const lowerText = text.toLowerCase();

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        category = cat;
      }
    }

    // Calculate confidence based on what we found
    let confidence = 50;
    if (amount > 0) confidence += 30;
    if (maxMatches > 0) confidence += 20;

    return {
      amount: amount || 0,
      category: category,
      description: text.trim(),
      confidence: confidence,
      needsClarification: confidence < 70 || amount === 0,
      clarificationQuestion: confidence < 70 
        ? "Could you provide more details about the amount and category?" 
        : undefined
    };

  } catch (error: any) {
    console.error("❌ Parsing error:", error);
    throw error;
  }
};

/**
 * Generate a friendly response message
 */
export const generateAIResponse = async (
  expenseData: ExpenseData,
  familyTotal: number,
  userMessage?: string
): Promise<string> => {
  try {
    // Detect language from user's message if provided
    let isEnglish = true;
    if (userMessage) {
      const detectedLanguage = await detectLanguage(userMessage);
      isEnglish = !detectedLanguage || detectedLanguage === "en";
    }

    // Generate response based on language
    if (isEnglish) {
      return `Great! Added ₹${expenseData.amount} to ${expenseData.category}. Your family total is now ₹${familyTotal}. Keep tracking! 💰`;
    } else {
      // Malayalam response
      return `മികച്ചത്! ₹${expenseData.amount} ${expenseData.category} ൽ ചേർത്തു. നിങ്ങളുടെ കുടുംബ ആകെ ₹${familyTotal} ആണ്. 💰`;
    }

  } catch (error) {
    console.error("❌ Error generating response:", error);
    return `Added ₹${expenseData.amount} to ${expenseData.category}. Family total: ₹${familyTotal}`;
  }
}