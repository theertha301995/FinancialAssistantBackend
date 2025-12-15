"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdvice = void 0;
const getAdvice = (expenses) => {
    const foodTotal = expenses
        .filter(e => e.category === "Food")
        .reduce((sum, e) => sum + e.amount, 0);
    if (foodTotal > 5000)
        return "Consider reducing dining expenses this month.";
    return "Spending looks balanced.";
};
exports.getAdvice = getAdvice;
//# sourceMappingURL=advisorService.js.map