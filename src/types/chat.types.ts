export interface ChatRequest {
  message: string;
  userId: string;
  familyId: string;
}

export interface ChatResponse {
  type: string;
  content: string;
  data?: any;
}

export interface Intent {
  type: IntentType;
  category?: string;
  period?: string;
  days?: number;
  data?: any;
}

export type IntentType = 
  | 'VIEW_TODAY_EXPENSES'
  | 'VIEW_RECENT_EXPENSES'
  | 'CATEGORY_BREAKDOWN'
  | 'TOTAL_SPENDING'
  | 'BUDGET_STATUS'
  | 'BUDGET_PREDICTION'
  | 'SPENDING_TRENDS'
  | 'COMPARE_PERIODS'
  | 'CATEGORY_SPECIFIC'
  | 'ADD_EXPENSE'
  | 'TOP_EXPENSES'
  | 'AVERAGE_SPENDING'
  | 'UNKNOWN';
