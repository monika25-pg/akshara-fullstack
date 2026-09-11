import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

const TRANSLATIONS = {
  en: {
    home: "Home",
    registerLogin: "Register / Login",
    profile: "Profile",
    dashboard: "Dashboard",
    learn: "Learn",
    assessment: "Assessment",
    levels: "Levels",
    logout: "Log out",
    notSignedIn: "Not signed in",
    signedIn: "Signed in",
    loading: "Loading…",
    submitAnswers: "Submit answers",
    submitting: "Submitting…",
    retakeAssessment: "Retake assessment",
    goToDashboard: "Go to dashboard →",
    answerEveryQuestion:
      "Answer every question, then submit. Your score updates your progress and proficiency level.",
    needSignIn:
      "You need to be signed in to submit an assessment.",
    registerOrLogin: "Register or log in",
    noAssessments: "No assessments available yet",
    noQuestions:
      "No questions are available for this assessment yet.",
  },

  hi: {
    home: "होम",
    registerLogin: "पंजीकरण / लॉगिन",
    profile: "प्रोफ़ाइल",
    dashboard: "डैशबोर्ड",
    learn: "सीखें",
    assessment: "मूल्यांकन",
    levels: "स्तर",
    logout: "लॉग आउट",
    notSignedIn: "साइन इन नहीं है",
    signedIn: "साइन इन किया गया",
    loading: "लोड हो रहा है…",
    submitAnswers: "उत्तर जमा करें",
    submitting: "जमा हो रहा है…",
    retakeAssessment: "मूल्यांकन फिर से करें",
    goToDashboard: "डैशबोर्ड पर जाएँ →",
    answerEveryQuestion:
      "हर प्रश्न का उत्तर दें और फिर जमा करें। आपका स्कोर आपकी प्रगति और दक्षता स्तर को अपडेट करेगा।",
    needSignIn:
      "मूल्यांकन जमा करने के लिए आपको साइन इन करना होगा।",
    registerOrLogin: "पंजीकरण करें या लॉगिन करें",
    noAssessments: "अभी कोई मूल्यांकन उपलब्ध नहीं है",
    noQuestions:
      "इस मूल्यांकन के लिए अभी कोई प्रश्न उपलब्ध नहीं है।",
  },

  kn: {
    home: "ಮುಖಪುಟ",
    registerLogin: "ನೋಂದಣಿ / ಲಾಗಿನ್",
    profile: "ಪ್ರೊಫೈಲ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    learn: "ಕಲಿಯಿರಿ",
    assessment: "ಮೌಲ್ಯಮಾಪನ",
    levels: "ಮಟ್ಟಗಳು",
    logout: "ಲಾಗ್ ಔಟ್",
    notSignedIn: "ಸೈನ್ ಇನ್ ಆಗಿಲ್ಲ",
    signedIn: "ಸೈನ್ ಇನ್ ಆಗಿದ್ದಾರೆ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
    submitAnswers: "ಉತ್ತರಗಳನ್ನು ಸಲ್ಲಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ…",
    retakeAssessment: "ಮೌಲ್ಯಮಾಪನವನ್ನು ಮತ್ತೆ ಮಾಡಿ",
    goToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ →",
    answerEveryQuestion:
      "ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸಿ ಮತ್ತು ನಂತರ ಸಲ್ಲಿಸಿ. ನಿಮ್ಮ ಅಂಕವು ನಿಮ್ಮ ಪ್ರಗತಿ ಮತ್ತು ಪ್ರಾವೀಣ್ಯತೆಯ ಮಟ್ಟವನ್ನು ನವೀಕರಿಸುತ್ತದೆ.",
    needSignIn:
      "ಮೌಲ್ಯಮಾಪನವನ್ನು ಸಲ್ಲಿಸಲು ನೀವು ಸೈನ್ ಇನ್ ಆಗಿರಬೇಕು.",
    registerOrLogin: "ನೋಂದಣಿ ಮಾಡಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ",
    noAssessments: "ಇನ್ನೂ ಯಾವುದೇ ಮೌಲ್ಯಮಾಪನ ಲಭ್ಯವಿಲ್ಲ",
    noQuestions:
      "ಈ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿಲ್ಲ.",
  },

  te: {
    home: "హోమ్",
    registerLogin: "నమోదు / లాగిన్",
    profile: "ప్రొఫైల్",
    dashboard: "డ్యాష్‌బోర్డ్",
    learn: "నేర్చుకోండి",
    assessment: "మూల్యాంకనం",
    levels: "స్థాయిలు",
    logout: "లాగ్ అవుట్",
    notSignedIn: "సైన్ ఇన్ కాలేదు",
    signedIn: "సైన్ ఇన్ చేశారు",
    loading: "లోడ్ అవుతోంది…",
    submitAnswers: "సమాధానాలను సమర్పించండి",
    submitting: "సమర్పిస్తోంది…",
    retakeAssessment: "మూల్యాంకనాన్ని మళ్లీ చేయండి",
    goToDashboard: "డ్యాష్‌బోర్డ్‌కు వెళ్లండి →",
    answerEveryQuestion:
      "ప్రతి ప్రశ్నకు సమాధానం ఇచ్చి, తర్వాత సమర్పించండి. మీ స్కోర్ మీ పురోగతి మరియు నైపుణ్య స్థాయిని నవీకరిస్తుంది.",
    needSignIn:
      "మూల్యాంకనాన్ని సమర్పించడానికి మీరు సైన్ ఇన్ చేసి ఉండాలి.",
    registerOrLogin: "నమోదు చేసుకోండి లేదా లాగిన్ చేయండి",
    noAssessments: "ఇంకా ఎలాంటి మూల్యాంకనాలు అందుబాటులో లేవు",
    noQuestions:
      "ఈ మూల్యాంకనానికి ఇంకా ప్రశ్నలు అందుబాటులో లేవు.",
  },

  ta: {
    home: "முகப்பு",
    registerLogin: "பதிவு / உள்நுழைவு",
    profile: "சுயவிவரம்",
    dashboard: "டாஷ்போர்டு",
    learn: "கற்றுக்கொள்ளுங்கள்",
    assessment: "மதிப்பீடு",
    levels: "நிலைகள்",
    logout: "வெளியேறு",
    notSignedIn: "உள்நுழையவில்லை",
    signedIn: "உள்நுழைந்துள்ளார்",
    loading: "ஏற்றப்படுகிறது…",
    submitAnswers: "பதில்களைச் சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கப்படுகிறது…",
    retakeAssessment: "மதிப்பீட்டை மீண்டும் செய்யவும்",
    goToDashboard: "டாஷ்போர்டுக்குச் செல்லுங்கள் →",
    answerEveryQuestion:
      "ஒவ்வொரு கேள்விக்கும் பதிலளித்து, பின்னர் சமர்ப்பிக்கவும். உங்கள் மதிப்பெண் உங்கள் முன்னேற்றத்தையும் திறன் நிலையையும் புதுப்பிக்கும்.",
    needSignIn:
      "மதிப்பீட்டைச் சமர்ப்பிக்க நீங்கள் உள்நுழைந்திருக்க வேண்டும்.",
    registerOrLogin: "பதிவு செய்யவும் அல்லது உள்நுழையவும்",
    noAssessments: "இன்னும் மதிப்பீடுகள் எதுவும் இல்லை",
    noQuestions:
      "இந்த மதிப்பீட்டிற்கு இன்னும் கேள்விகள் எதுவும் இல்லை.",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return (
      localStorage.getItem("akshara_interface_language") || "en"
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "akshara_interface_language",
      language
    );

    window.dispatchEvent(
      new CustomEvent("akshara-language-change", {
        detail: language,
      })
    );
  }, [language]);

  const t = (key) => {
    return (
      TRANSLATIONS[language]?.[key] ||
      TRANSLATIONS.en[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}