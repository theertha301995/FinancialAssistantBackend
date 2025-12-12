// File: src/services/aiExpenseService.ts
import Anthropic from "@anthropic-ai/sdk";
import { detectLanguage } from "./transalationService";

// ============================================
// AI CHAT EXPENSE SERVICE
// Uses Claude API to parse natural language expenses
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
 * Parse natural language text into expense data using AI
 * Examples:
 * - "I spent 200 rupees on groceries"
 * - "500 രൂപ ഭക്ഷണത്തിന്"
 * - "Bought a dress for 1500"
 */
export const parseExpenseWithAI = async (
  text: string
): Promise<ExpenseData> => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not found in environment variables");
  }

  console.log("🤖 Sending to Claude AI:", text);

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Parse this expense entry and return ONLY a JSON object with these fields:
- amount (number)
- category (string: Food, Transport, Shopping, Entertainment, Health, Bills, or Other)
- description (string)
- confidence (number 0-100)

Text: "${text}"

Return ONLY the JSON, no explanation.`
        }
      ]
    });

    const responseText = message.content[0].type === "text" 
      ? message.content[0].text 
      : "";
    
    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    const confidence = parsed.confidence || 50;
    
    return {
      amount: parsed.amount || 0,
      category: parsed.category || "Other",
      description: parsed.description || text,
      confidence: confidence,
      needsClarification: confidence < 70,
      clarificationQuestion: confidence < 70 
        ? "I'm not fully confident about this expense. Is this correct?" 
        : undefined
    };

  } catch (error: any) {
    // Log the error but DON'T fall back to NLP here
    // Let the unified parser handle fallback logic
    console.error("❌ AI parsing error:", error.status, JSON.stringify(error));
    throw error; // Re-throw to let caller handle it
  }
};

/**
 * Generate a friendly AI response in the user's language
 */
export const generateAIResponse = async (
  expenseData: ExpenseData,
  familyTotal: number,
  userMessage?: string
): Promise<string> => {
  try {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      return `Added ₹${expenseData.amount} to ${expenseData.category}. Family total: ₹${familyTotal}`;
    }

    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    // Detect language from user's message if provided
    let languageInstruction = "";
    if (userMessage) {
      const detectedLanguage = await detectLanguage(userMessage);
      if (detectedLanguage && detectedLanguage !== "en") {
        languageInstruction = `\n\nIMPORTANT: Respond in the same language as the user's original message: "${userMessage}"`;
      }
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Generate a brief, friendly confirmation message for this expense:
Amount: ₹${expenseData.amount}
Category: ${expenseData.category}
Family Total: ₹${familyTotal}

Keep it short (1-2 sentences), friendly, and encouraging about tracking expenses.${languageInstruction}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === "text") {
      return content.text;
    }

    return `Added ₹${expenseData.amount} to ${expenseData.category}. Family total: ₹${familyTotal}`;

  } catch (error) {
    console.error("❌ Error generating AI response:", error);
    return `Added ₹${expenseData.amount} to ${expenseData.category}. Family total: ₹${familyTotal}`;
  }
};