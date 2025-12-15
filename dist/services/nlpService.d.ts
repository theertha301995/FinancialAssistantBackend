interface ParsedExpense {
    amount: number;
    category: string;
    description: string;
    confidence: number;
}
/**
 * Enhanced expense categorizer with extensive multilingual support
 * Detects categories in English, Malayalam, Hindi, Tamil, Telugu, Kannada, etc.
 */
export declare const categorizeExpense: (text: string) => Promise<string>;
/**
 * Extract amount from text - supports multiple number formats
 */
export declare const extractAmount: (text: string) => number;
/**
 * Extract date from text
 */
export declare const extractDate: (text: string) => Date | null;
/**
 * Complete expense parser using NLP
 */
export declare const parseExpenseWithNLP: (text: string) => Promise<ParsedExpense>;
/**
 * Detect if text is an expense entry vs question
 */
export declare const isExpenseEntry: (text: string) => boolean;
/**
 * Normalize text
 */
export declare const normalizeText: (text: string) => string;
/**
 * Extract keywords
 */
export declare const extractKeywords: (text: string) => string[];
/**
 * Generate description
 */
export declare const generateDescription: (category: string, amount: number, originalText: string) => string;
/**
 * Validate expense data
 */
export declare const validateExpense: (expense: ParsedExpense) => {
    valid: boolean;
    errors: string[];
};
export {};
