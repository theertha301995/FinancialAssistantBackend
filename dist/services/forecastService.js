"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forecastSpending = void 0;
const forecastSpending = (expenses) => {
    if (expenses.length === 0)
        return "No data to forecast.";
    const avg = expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;
    return `Expected spending next week: ₹${Math.round(avg * 7)}`;
};
exports.forecastSpending = forecastSpending;
//# sourceMappingURL=forecastService.js.map