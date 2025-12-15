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
export declare const parseExpenseWithAI: (text: string) => Promise<ExpenseData>;
/**
 * Generate a friendly response message
 */
export declare const generateAIResponse: (expenseData: ExpenseData, familyTotal: number, userMessage?: string) => Promise<string>;
export {};
