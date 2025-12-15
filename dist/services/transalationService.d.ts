interface TranslationResult {
    translatedText: string;
    detectedLanguage: string;
    confidence: number;
}
/**
 * Detect language of given text with confidence score
 */
export declare const detectLanguage: (text: string) => Promise<string>;
/**
 * Translate text from any language to English
 */
export declare const translateToEnglish: (text: string) => Promise<TranslationResult>;
/**
 * Translate text from English back to target language
 */
export declare const translateFromEnglish: (text: string, targetLang: string) => Promise<string>;
/**
 * Translate text (auto-detect source language)
 */
export declare const translateText: (text: string, targetLang: string) => Promise<string>;
/**
 * Batch translate multiple texts
 */
export declare const batchTranslate: (texts: string[], targetLang: string) => Promise<string[]>;
/**
 * Get language name from code
 */
export declare const getLanguageName: (code: string) => string;
/**
 * Normalize language codes
 */
export declare const normalizeLanguageCode: (code: string) => string;
export {};
