// File: src/services/expenseParser.ts
// FREE VERSION - No API costs!

import { parseExpenseWithNLP, isExpenseEntry } from "./nlpService";

export interface ParsedExpenseData {
  amount: number;
  category: string;
  description: string;
  confidence: number;
  needsClarification: boolean;
  clarificationQuestion?: string;
  parser: "nlp";
}

/**
 * Parse expense using NLP (100% FREE)
 * No API calls, works offline, instant results
 */
export const parseExpense = async (
  text: string,
  options?: {
    preferAI?: boolean; // Ignored in free version
    requireHighConfidence?: boolean;
  }
): Promise<ParsedExpenseData> => {
  const { requireHighConfidence = false } = options || {};

  // First, check if this is actually an expense entry
  if (!isExpenseEntry(text)) {
    return {
      amount: 0,
      category: "Other",
      description: text,
      confidence: 0,
      needsClarification: true,
      clarificationQuestion: "This doesn't look like an expense. Did you want to ask a question instead?",
      parser: "nlp"
    };
  }

  try {
    // Use NLP parsing (free and fast!)
    console.log("📝 Using NLP parsing (FREE)...");
    const nlpResult = await parseExpenseWithNLP(text);
    
    return {
      ...nlpResult,
      needsClarification: requireHighConfidence 
        ? nlpResult.confidence < 80 
        : nlpResult.confidence < 50,
      clarificationQuestion: nlpResult.confidence < 70 
        ? "Please confirm this expense is correct" 
        : undefined,
      parser: "nlp"
    };

  } catch (error: any) {
    console.error("❌ Error in expense parsing:", error.message);
    
    // Return empty result on error
    return {
      amount: 0,
      category: "Other",
      description: text,
      confidence: 0,
      needsClarification: true,
      clarificationQuestion: "Could not parse expense. Please try rephrasing.",
      parser: "nlp"
    };
  }
};

/**
 * Batch parse multiple expenses
 */
export const batchParseExpenses = async (
  messages: string[]
): Promise<ParsedExpenseData[]> => {
  const results = await Promise.all(
    messages.map(message => parseExpense(message))
  );
  return results;
};

/**
 * Get parsing statistics
 */
export const getParsingStats = (results: ParsedExpenseData[]) => {
  const total = results.length;
  const successful = results.filter(r => r.amount > 0).length;
  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / total;

  return {
    total,
    successful,
    successRate: (successful / total) * 100,
    nlpParsed: total,
    avgConfidence: Math.round(avgConfidence)
  };
};