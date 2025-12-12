// File: src/services/translationService.ts
// Enhanced multilingual support with bidirectional translation
import axios from "axios";

interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
}

/**
 * Detect language of given text with confidence score
 */
export const detectLanguage = async (text: string): Promise<string> => {
  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "auto",
          tl: "en",
          dt: "t",
          q: text.substring(0, 500) // First 500 chars for detection
        },
        timeout: 10000
      }
    );

    // Language is in response.data[2]
    if (response.data && response.data[2]) {
      return response.data[2];
    }

    return "en"; // Default to English
  } catch (error) {
    console.error("❌ Language detection error:", error);
    return "en";
  }
};

/**
 * Translate text from any language to English
 */
export const translateToEnglish = async (
  text: string
): Promise<TranslationResult> => {
  try {
    // First detect the language
    const detectedLang = await detectLanguage(text);
    
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
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: detectedLang,
          tl: "en",
          dt: "t",
          q: text
        },
        timeout: 10000
      }
    );

    if (response.data && Array.isArray(response.data)) {
      const translations = response.data[0];
      if (Array.isArray(translations)) {
        const translatedText = translations
          .map((item: any) => item[0])
          .filter((text: any) => text)
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

  } catch (error: any) {
    console.error("❌ Translation to English error:", error.message);
    
    // Try MyMemory API fallback
    try {
      const fallbackResponse = await axios.get(
        "https://api.mymemory.translated.net/get",
        {
          params: {
            q: text,
            langpair: "auto|en"
          },
          timeout: 10000
        }
      );

      if (fallbackResponse.data?.responseData?.translatedText) {
        return {
          translatedText: fallbackResponse.data.responseData.translatedText,
          detectedLanguage: "unknown",
          confidence: 70
        };
      }
    } catch (fallbackError) {
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

/**
 * Translate text from English back to target language
 */
export const translateFromEnglish = async (
  text: string,
  targetLang: string
): Promise<string> => {
  // If target is English, return as-is
  if (targetLang === "en") {
    return text;
  }

  try {
    console.log(`🌐 Translating response to ${targetLang}...`);

    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "en",
          tl: targetLang,
          dt: "t",
          q: text
        },
        timeout: 10000
      }
    );

    if (response.data && Array.isArray(response.data)) {
      const translations = response.data[0];
      if (Array.isArray(translations)) {
        const translatedText = translations
          .map((item: any) => item[0])
          .filter((text: any) => text)
          .join("");
        
        return translatedText || text;
      }
    }

    return text;

  } catch (error: any) {
    console.error("❌ Translation from English error:", error.message);
    
    // Try fallback
    try {
      const fallbackResponse = await axios.get(
        "https://api.mymemory.translated.net/get",
        {
          params: {
            q: text,
            langpair: `en|${targetLang}`
          },
          timeout: 10000
        }
      );

      if (fallbackResponse.data?.responseData?.translatedText) {
        return fallbackResponse.data.responseData.translatedText;
      }
    } catch (fallbackError) {
      console.error("❌ Fallback translation failed");
    }

    return text; // Return English version if translation fails
  }
};

/**
 * Translate text (auto-detect source language)
 */
export const translateText = async (
  text: string,
  targetLang: string
): Promise<string> => {
  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "auto",
          tl: targetLang,
          dt: "t",
          q: text
        },
        timeout: 10000
      }
    );

    if (response.data && Array.isArray(response.data)) {
      const translations = response.data[0];
      if (Array.isArray(translations)) {
        const translatedText = translations
          .map((item: any) => item[0])
          .filter((text: any) => text)
          .join("");
        
        return translatedText || text;
      }
    }

    return text;

  } catch (error: any) {
    console.error("Translation error:", error.message);
    return text;
  }
};

/**
 * Batch translate multiple texts
 */
export const batchTranslate = async (
  texts: string[],
  targetLang: string
): Promise<string[]> => {
  try {
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLang))
    );
    return translations;
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts;
  }
};

/**
 * Get language name from code
 */
export const getLanguageName = (code: string): string => {
  const langNames: { [key: string]: string } = {
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

/**
 * Normalize language codes
 */
export const normalizeLanguageCode = (code: string): string => {
  const langMap: { [key: string]: string } = {
    "ml": "ml", "hi": "hi", "ta": "ta", "te": "te",
    "kn": "kn", "bn": "bn", "gu": "gu", "mr": "mr",
    "pa": "pa", "en": "en", "es": "es", "fr": "fr",
    "de": "de", "ar": "ar", "zh": "zh"
  };
  
  return langMap[code.toLowerCase()] || code;
};