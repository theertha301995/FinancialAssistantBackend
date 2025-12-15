"use strict";
// File: src/services/nlpService.ts
// Enhanced with multilingual category detection
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExpense = exports.generateDescription = exports.extractKeywords = exports.normalizeText = exports.isExpenseEntry = exports.parseExpenseWithNLP = exports.extractDate = exports.extractAmount = exports.categorizeExpense = void 0;
/**
 * Enhanced expense categorizer with extensive multilingual support
 * Detects categories in English, Malayalam, Hindi, Tamil, Telugu, Kannada, etc.
 */
const categorizeExpense = async (text) => {
    const lower = text.toLowerCase();
    // Food & Dining (Multi-language)
    if (
    // English
    lower.includes("food") || lower.includes("lunch") || lower.includes("dinner") ||
        lower.includes("breakfast") || lower.includes("snacks") || lower.includes("restaurant") ||
        lower.includes("cafe") || lower.includes("coffee") || lower.includes("pizza") ||
        lower.includes("burger") || lower.includes("grocery") || lower.includes("groceries") ||
        lower.includes("meal") || lower.includes("eating") || lower.includes("dine") ||
        // Malayalam
        lower.includes("ഭക്ഷണം") || lower.includes("ഭക്ഷണ") || lower.includes("ഭക്ഷണത്തിന്") ||
        lower.includes("ഭക്ഷണത്തിനായി") || lower.includes("ഭക്ഷണത്തിനു") ||
        // Hindi
        lower.includes("भोजन") || lower.includes("खाना") || lower.includes("खाने") ||
        lower.includes("नाश्ता") || lower.includes("दोपहर") || lower.includes("रात") ||
        // Tamil
        lower.includes("உணவு") || lower.includes("சாப்பாடு") || lower.includes("உணவுக்கு") ||
        // Telugu
        lower.includes("ఆహారం") || lower.includes("భోజనం") || lower.includes("తిండి") ||
        // Kannada
        lower.includes("ಆಹಾರ") || lower.includes("ಊಟ")) {
        return "Food";
    }
    // Transport (Multi-language)
    if (
    // English
    lower.includes("uber") || lower.includes("ola") || lower.includes("taxi") ||
        lower.includes("bus") || lower.includes("metro") || lower.includes("train") ||
        lower.includes("auto") || lower.includes("rickshaw") || lower.includes("fuel") ||
        lower.includes("petrol") || lower.includes("diesel") || lower.includes("gas") ||
        lower.includes("transport") || lower.includes("travel") || lower.includes("ride") ||
        // Malayalam
        lower.includes("യാത്ര") || lower.includes("യാത്രയ്ക്ക") || lower.includes("യാത്രക്ക്") ||
        lower.includes("ഓട്ടോ") || lower.includes("ടാക്സി") || lower.includes("ബസ്") ||
        // Hindi
        lower.includes("यात्रा") || lower.includes("परिवहन") || lower.includes("टैक्सी") ||
        lower.includes("बस") || lower.includes("मेट्रो") || lower.includes("पेट्रोल") ||
        // Tamil
        lower.includes("பயணம்") || lower.includes("போக்குவரத்து") || lower.includes("டாக்சி") ||
        // Telugu
        lower.includes("ప్రయాణం") || lower.includes("రవాణా") || lower.includes("టాక్సీ") ||
        // Kannada
        lower.includes("ಪ್ರಯಾಣ") || lower.includes("ಸಾರಿಗೆ")) {
        return "Transport";
    }
    // Shopping (Multi-language)
    if (
    // English
    lower.includes("shopping") || lower.includes("clothes") || lower.includes("dress") ||
        lower.includes("shirt") || lower.includes("shoes") || lower.includes("jeans") ||
        lower.includes("amazon") || lower.includes("flipkart") || lower.includes("mall") ||
        lower.includes("purchase") || lower.includes("buy") || lower.includes("bought") ||
        // Malayalam
        lower.includes("ഷോപ്പിംഗ്") || lower.includes("വാങ്ങി") || lower.includes("വാങ്ങൽ") ||
        lower.includes("വസ്ത്രം") || lower.includes("വസ്ത്രത്തിന്") ||
        // Hindi
        lower.includes("खरीदारी") || lower.includes("खरीदा") || lower.includes("कपड़े") ||
        lower.includes("शॉपिंग") || lower.includes("वस्त्र") ||
        // Tamil
        lower.includes("ஷாப்பிங்") || lower.includes("வாங்கினேன்") || lower.includes("உடை") ||
        // Telugu
        lower.includes("షాపింగ్") || lower.includes("కొనుగోలు") || lower.includes("బట్టలు") ||
        // Kannada
        lower.includes("ಶಾಪಿಂಗ್") || lower.includes("ಖರೀದಿ") || lower.includes("ಬಟ್ಟೆ")) {
        return "Shopping";
    }
    // Bills & Utilities (Multi-language)
    if (
    // English
    lower.includes("rent") || lower.includes("electricity") || lower.includes("water") ||
        lower.includes("internet") || lower.includes("wifi") || lower.includes("mobile") ||
        lower.includes("phone") || lower.includes("bill") || lower.includes("utility") ||
        lower.includes("recharge") || lower.includes("subscription") ||
        // Malayalam
        lower.includes("ബിൽ") || lower.includes("വൈദ്യുതി") || lower.includes("വാടക") ||
        lower.includes("ഇന്റർനെറ്റ്") || lower.includes("മൊബൈൽ") ||
        // Hindi
        lower.includes("बिल") || lower.includes("किराया") || lower.includes("बिजली") ||
        lower.includes("पानी") || lower.includes("इंटरनेट") || lower.includes("मोबाइल") ||
        // Tamil
        lower.includes("பில்") || lower.includes("வாடகை") || lower.includes("மின்சாரம்") ||
        // Telugu
        lower.includes("బిల్లు") || lower.includes("అద్దె") || lower.includes("విద్యుత్") ||
        // Kannada
        lower.includes("ಬಿಲ್") || lower.includes("ಬಾಡಿಗೆ") || lower.includes("ವಿದ್ಯುತ್")) {
        return "Bills";
    }
    // Entertainment (Multi-language)
    if (
    // English
    lower.includes("movie") || lower.includes("cinema") || lower.includes("theatre") ||
        lower.includes("netflix") || lower.includes("prime") || lower.includes("spotify") ||
        lower.includes("game") || lower.includes("party") || lower.includes("concert") ||
        lower.includes("entertainment") || lower.includes("music") || lower.includes("show") ||
        // Malayalam
        lower.includes("സിനിമ") || lower.includes("സിനിമയ്ക്ക") || lower.includes("വിനോദം") ||
        // Hindi
        lower.includes("फिल्म") || lower.includes("सिनेमा") || lower.includes("मनोरंजन") ||
        // Tamil
        lower.includes("சினிமா") || lower.includes("திரைப்படம்") || lower.includes("பொழுதுபோக்கு") ||
        // Telugu
        lower.includes("సినిమా") || lower.includes("వినోదం") ||
        // Kannada
        lower.includes("ಚಿತ್ರ") || lower.includes("ಸಿನೆಮಾ") || lower.includes("ಮನರಂಜನೆ")) {
        return "Entertainment";
    }
    // Health & Medical (Multi-language)
    if (
    // English
    lower.includes("medicine") || lower.includes("doctor") || lower.includes("hospital") ||
        lower.includes("pharmacy") || lower.includes("medical") || lower.includes("health") ||
        lower.includes("clinic") || lower.includes("dentist") || lower.includes("checkup") ||
        lower.includes("treatment") || lower.includes("drug") ||
        // Malayalam
        lower.includes("ആരോഗ്യം") || lower.includes("മരുന്ന്") || lower.includes("ഡോക്ടർ") ||
        lower.includes("ആശുപത്രി") ||
        // Hindi
        lower.includes("स्वास्थ्य") || lower.includes("दवा") || lower.includes("डॉक्टर") ||
        lower.includes("अस्पताल") || lower.includes("चिकित्सा") ||
        // Tamil
        lower.includes("மருத்துவம்") || lower.includes("மருந்து") || lower.includes("மருத்துவர்") ||
        // Telugu
        lower.includes("ఆరోగ్యం") || lower.includes("మందు") || lower.includes("వైద్యుడు") ||
        // Kannada
        lower.includes("ಆರೋಗ್ಯ") || lower.includes("ಔಷಧ") || lower.includes("ವೈದ್ಯ")) {
        return "Health";
    }
    // Education (Multi-language)
    if (
    // English
    lower.includes("book") || lower.includes("course") || lower.includes("class") ||
        lower.includes("tuition") || lower.includes("school") || lower.includes("college") ||
        lower.includes("education") || lower.includes("study") || lower.includes("exam") ||
        // Malayalam
        lower.includes("വിദ്യാഭ്യാസം") || lower.includes("പഠനം") || lower.includes("പുസ്തകം") ||
        // Hindi
        lower.includes("शिक्षा") || lower.includes("पढ़ाई") || lower.includes("किताब") ||
        // Tamil
        lower.includes("கல்வி") || lower.includes("புத்தகம்") ||
        // Telugu
        lower.includes("విద్య") || lower.includes("పుస్తకం") ||
        // Kannada
        lower.includes("ಶಿಕ್ಷಣ") || lower.includes("ಪುಸ್ತಕ")) {
        return "Education";
    }
    // Default
    return "Other";
};
exports.categorizeExpense = categorizeExpense;
/**
 * Extract amount from text - supports multiple number formats
 */
const extractAmount = (text) => {
    // Remove currency symbols and words
    const cleaned = text
        .replace(/₹|rs\.?|rupees?|inr|രൂപ|रुपये|रुपए|ரூபாய்|రూపాయి|ರೂಪಾಯಿ/gi, " ");
    // Try different number formats
    const patterns = [
        /(\d+(?:,\d{3})*(?:\.\d{2})?)/, // 1,000.00
        /(\d+(?:\.\d{3})*(?:,\d{2})?)/, // 1.000,00
        /(\d+)/ // Simple digits
    ];
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
            const amount = parseFloat(match[1].replace(/,/g, ""));
            if (!isNaN(amount) && amount > 0) {
                return amount;
            }
        }
    }
    return 0;
};
exports.extractAmount = extractAmount;
/**
 * Extract date from text
 */
const extractDate = (text) => {
    const lower = text.toLowerCase();
    const today = new Date();
    // Today (multi-language)
    if (lower.includes("today") || lower.includes("ഇന്ന്") ||
        lower.includes("आज") || lower.includes("இன்று") ||
        lower.includes("ఈరోజు") || lower.includes("ಇವತ್ತು")) {
        return today;
    }
    // Yesterday (multi-language)
    if (lower.includes("yesterday") || lower.includes("ഇന്നലെ") ||
        lower.includes("कल") || lower.includes("நேற்று") ||
        lower.includes("నిన్న") || lower.includes("ನಿನ್ನೆ")) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    }
    // Date pattern: DD/MM/YYYY or DD-MM-YYYY
    const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
    const dateMatch = text.match(datePattern);
    if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]) - 1;
        const year = dateMatch[3].length === 2
            ? 2000 + parseInt(dateMatch[3])
            : parseInt(dateMatch[3]);
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return null;
};
exports.extractDate = extractDate;
/**
 * Complete expense parser using NLP
 */
const parseExpenseWithNLP = async (text) => {
    const amount = (0, exports.extractAmount)(text);
    const category = await (0, exports.categorizeExpense)(text);
    const date = (0, exports.extractDate)(text);
    // Calculate confidence
    let confidence = 0;
    if (amount > 0)
        confidence += 50;
    if (category !== "Other")
        confidence += 30;
    if (text.length > 10)
        confidence += 20;
    return {
        amount,
        category,
        description: text.trim(),
        confidence: Math.min(confidence, 100)
    };
};
exports.parseExpenseWithNLP = parseExpenseWithNLP;
/**
 * Detect if text is an expense entry vs question
 */
const isExpenseEntry = (text) => {
    const lower = text.toLowerCase();
    // Question indicators (multi-language)
    const questionWords = [
        "how much", "what", "when", "where", "show", "tell", "?",
        "എത്ര", "എന്ത്", "എവിടെ", "എപ്പോൾ",
        "कितना", "क्या", "कहाँ", "कब",
        "எவ்வளவு", "என்ன", "எங்கே", "எப்போது",
        "ఎంత", "ఏమిటి", "ఎక్కడ", "ఎప్పుడు",
        "ಎಷ್ಟು", "ಏನು", "ಎಲ್ಲಿ", "ಯಾವಾಗ"
    ];
    if (questionWords.some(word => lower.includes(word))) {
        return false;
    }
    // Expense indicators
    const expenseWords = ["spent", "paid", "bought", "purchase", "cost", "₹", "rupees", "rs"];
    if (expenseWords.some(word => lower.includes(word))) {
        return true;
    }
    // Has a number
    if (/\d+/.test(text)) {
        return true;
    }
    return false;
};
exports.isExpenseEntry = isExpenseEntry;
/**
 * Normalize text
 */
const normalizeText = (text) => {
    return text
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^\w\s₹.,\-\/]/gi, "");
};
exports.normalizeText = normalizeText;
/**
 * Extract keywords
 */
const extractKeywords = (text) => {
    const normalized = (0, exports.normalizeText)(text).toLowerCase();
    const stopWords = ["i", "a", "an", "the", "for", "on", "in", "at", "to", "of", "and", "is", "was"];
    const words = normalized.split(" ")
        .filter(word => word.length > 2)
        .filter(word => !stopWords.includes(word))
        .filter(word => !/^\d+$/.test(word));
    return [...new Set(words)];
};
exports.extractKeywords = extractKeywords;
/**
 * Generate description
 */
const generateDescription = (category, amount, originalText) => {
    const keywords = (0, exports.extractKeywords)(originalText);
    if (keywords.length > 0) {
        return `${category} - ${keywords.slice(0, 3).join(" ")}`;
    }
    return `${category} expense of ₹${amount}`;
};
exports.generateDescription = generateDescription;
/**
 * Validate expense data
 */
const validateExpense = (expense) => {
    const errors = [];
    if (!expense.amount || expense.amount <= 0) {
        errors.push("Amount must be greater than 0");
    }
    if (expense.amount > 1000000) {
        errors.push("Amount seems unusually high");
    }
    if (!expense.category) {
        errors.push("Category is required");
    }
    if (!expense.description || expense.description.length < 3) {
        errors.push("Description is too short");
    }
    return {
        valid: errors.length === 0,
        errors
    };
};
exports.validateExpense = validateExpense;
//# sourceMappingURL=nlpService.js.map