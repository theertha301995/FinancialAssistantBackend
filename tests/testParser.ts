// File: src/tests/testFreeParser.ts
// Test the FREE NLP parser

import { parseExpense } from "../services/expenseParser";

const testMessages = [
  "I spent 200 rupees on groceries",
  "Paid 500 for taxi to office",
  "Bought a new shirt for 1500",
  "500 രൂപ ഭക്ഷണത്തിന്",
  "Netflix subscription 199",
  "Doctor visit 800 rupees",
  "Electricity bill 2500",
  "Movie tickets for 400",
  "Just spent 50 on tea",
  "Fuel ₹1200"
];

async function testFreeParser() {
  console.log("🧪 TESTING FREE NLP PARSER\n");
  console.log("=".repeat(80));
  console.log();

  for (const message of testMessages) {
    console.log(`📝 Message: "${message}"`);
    
    const startTime = Date.now();
    const result = await parseExpense(message, { preferAI: false });
    const timeTaken = Date.now() - startTime;
    
    console.log(`   ✅ Amount: ₹${result.amount}`);
    console.log(`   📂 Category: ${result.category}`);
    console.log(`   📊 Confidence: ${result.confidence}%`);
    console.log(`   ⚡ Time: ${timeTaken}ms`);
    console.log(`   🔧 Parser: ${result.parser}`);
    
    if (result.needsClarification) {
      console.log(`   ⚠️  Needs clarification: ${result.clarificationQuestion}`);
    }
    
    console.log();
    console.log("-".repeat(80));
    console.log();
  }

  console.log("✅ ALL TESTS COMPLETED!");
  console.log("💰 Total Cost: ₹0 (100% FREE!)");
}

testFreeParser().catch(console.error);