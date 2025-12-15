"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLanguageCode = exports.getLanguageName = exports.batchTranslate = exports.translateText = exports.translateFromEnglish = exports.translateToEnglish = exports.detectLanguage = void 0;
// File: src/services/translationService.ts
// Enhanced multilingual support with bidirectional translation
const axios_1 = __importDefault(require("axios"));
/**
 * Detect language of given text with confidence score
 */
const detectLanguage = async (text) => {
    try {
        const response = await axios_1.default.get("https://translate.googleapis.com/translate_a/single", {
            params: {
                client: "gtx",
                sl: "auto",
                tl: "en",
                dt: "t",
                q: text.substring(0, 500) // First 500 chars for detection
            },
            timeout: 10000
        });
        // Language is in response.data[2]
        if (response.data && response.data[2]) {
            return response.data[2];
        }
        return "en"; // Default to English
    }
    catch (error) {
        console.error("❌ Language detection error:", error);
        return "en";
    }
};
exports.detectLanguage = detectLanguage;
/**
 * Translate text from any language to English
 */
const translateToEnglish = async (text) => {
    try {
        // First detect the language
        const detectedLang = await (0, exports.detectLanguage)(text);
        // If already English, return as-is
        if (detectedLang === "en") {
            return {
                translatedText: text,
                detectedLanguage: "en",
                confidence: 100
            };
        }
        console.log(`🌐 Detected language: ${detectedLang}, translating to English...`);
        // Translate to English
        const response = await axios_1.default.get("https://translate.googleapis.com/translate_a/single", {
            params: {
                client: "gtx",
                sl: detectedLang,
                tl: "en",
                dt: "t",
                q: text
            },
            timeout: 10000
        });
        if (response.data && Array.isArray(response.data)) {
            const translations = response.data[0];
            if (Array.isArray(translations)) {
                const translatedText = translations
                    .map((item) => item[0])
                    .filter((text) => text)
                    .join("");
                return {
                    translatedText: translatedText || text,
                    detectedLanguage: detectedLang,
                    confidence: 95
                };
            }
        }
        // Fallback if response format unexpected
        return {
            translatedText: text,
            detectedLanguage: detectedLang,
            confidence: 50
        };
    }
    catch (error) {
        console.error("❌ Translation to English error:", error.message);
        // Try MyMemory API fallback
        try {
            const fallbackResponse = await axios_1.default.get("https://api.mymemory.translated.net/get", {
                params: {
                    q: text,
                    langpair: "auto|en"
                },
                timeout: 10000
            });
            if (fallbackResponse.data?.responseData?.translatedText) {
                return {
                    translatedText: fallbackResponse.data.responseData.translatedText,
                    detectedLanguage: "unknown",
                    confidence: 70
                };
            }
        }
        catch (fallbackError) {
            console.error("❌ Fallback translation failed");
        }
        // Return original if all fails
        return {
            translatedText: text,
            detectedLanguage: "unknown",
            confidence: 0
        };
    }
};
exports.translateToEnglish = translateToEnglish;
/**
 * Translate text from English back to target language
 */
const translateFromEnglish = async (text, targetLang) => {
    // If target is English, return as-is
    if (targetLang === "en") {
        return text;
    }
    try {
        console.log(`🌐 Translating response to ${targetLang}...`);
        const response = await axios_1.default.get("https://translate.googleapis.com/translate_a/single", {
            params: {
                client: "gtx",
                sl: "en",
                tl: targetLang,
                dt: "t",
                q: text
            },
            timeout: 10000
        });
        if (response.data && Array.isArray(response.data)) {
            const translations = response.data[0];
            if (Array.isArray(translations)) {
                const translatedText = translations
                    .map((item) => item[0])
                    .filter((text) => text)
                    .join("");
                return translatedText || text;
            }
        }
        return text;
    }
    catch (error) {
        console.error("❌ Translation from English error:", error.message);
        // Try fallback
        try {
            const fallbackResponse = await axios_1.default.get("https://api.mymemory.translated.net/get", {
                params: {
                    q: text,
                    langpair: `en|${targetLang}`
                },
                timeout: 10000
            });
            if (fallbackResponse.data?.responseData?.translatedText) {
                return fallbackResponse.data.responseData.translatedText;
            }
        }
        catch (fallbackError) {
            console.error("❌ Fallback translation failed");
        }
        return text; // Return English version if translation fails
    }
};
exports.translateFromEnglish = translateFromEnglish;
/**
 * Translate text (auto-detect source language)
 */
const translateText = async (text, targetLang) => {
    try {
        const response = await axios_1.default.get("https://translate.googleapis.com/translate_a/single", {
            params: {
                client: "gtx",
                sl: "auto",
                tl: targetLang,
                dt: "t",
                q: text
            },
            timeout: 10000
        });
        if (response.data && Array.isArray(response.data)) {
            const translations = response.data[0];
            if (Array.isArray(translations)) {
                const translatedText = translations
                    .map((item) => item[0])
                    .filter((text) => text)
                    .join("");
                return translatedText || text;
            }
        }
        return text;
    }
    catch (error) {
        console.error("Translation error:", error.message);
        return text;
    }
};
exports.translateText = translateText;
/**
 * Batch translate multiple texts
 */
const batchTranslate = async (texts, targetLang) => {
    try {
        const translations = await Promise.all(texts.map(text => (0, exports.translateText)(text, targetLang)));
        return translations;
    }
    catch (error) {
        console.error("Batch translation error:", error);
        return texts;
    }
};
exports.batchTranslate = batchTranslate;
/**
 * Get language name from code
 */
const getLanguageName = (code) => {
    const langNames = {
        "ml": "Malayalam",
        "hi": "Hindi",
        "ta": "Tamil",
        "te": "Telugu",
        "kn": "Kannada",
        "bn": "Bengali",
        "gu": "Gujarati",
        "mr": "Marathi",
        "pa": "Punjabi",
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "ar": "Arabic",
        "zh": "Chinese"
    };
    return langNames[code] || code.toUpperCase();
};
exports.getLanguageName = getLanguageName;
/**
 * Normalize language codes
 */
const normalizeLanguageCode = (code) => {
    const langMap = {
        "ml": "ml", "hi": "hi", "ta": "ta", "te": "te",
        "kn": "kn", "bn": "bn", "gu": "gu", "mr": "mr",
        "pa": "pa", "en": "en", "es": "es", "fr": "fr",
        "de": "de", "ar": "ar", "zh": "zh"
    };
    return langMap[code.toLowerCase()] || code;
};
exports.normalizeLanguageCode = normalizeLanguageCode;
//# sourceMappingURL=transalationService.js.map