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
export declare const parseExpense: (text: string, options?: {
    preferAI?: boolean;
    requireHighConfidence?: boolean;
}) => Promise<ParsedExpenseData>;
/**
 * Batch parse multiple expenses
 */
export declare const batchParseExpenses: (messages: string[]) => Promise<ParsedExpenseData[]>;
/**
 * Get parsing statistics
 */
export declare const getParsingStats: (results: ParsedExpenseData[]) => {
    total: number;
    successful: number;
    successRate: number;
    nlpParsed: number;
    avgConfidence: number;
};
