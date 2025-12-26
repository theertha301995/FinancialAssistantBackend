import { Intent, ChatResponse } from '../types/chat.types';
export declare class ChatService {
    static analyzeIntent(message: string): Intent;
    private static extractPeriod;
    private static getPeriodDates;
    static processIntent(intent: Intent, userId: string, familyId: string): Promise<ChatResponse>;
    private static getTodayExpensesResponse;
    private static getRecentExpensesResponse;
    private static getCategoryBreakdownResponse;
    private static getTotalSpendingResponse;
    private static getBudgetStatusResponse;
    private static getBudgetPredictionResponse;
    private static getSpendingTrendsResponse;
    private static getCategorySpecificResponse;
    private static getTopExpensesResponse;
    private static getAverageSpendingResponse;
    private static comparePeriodsResponse;
    private static addExpenseResponse;
    private static getHelpResponse;
}
