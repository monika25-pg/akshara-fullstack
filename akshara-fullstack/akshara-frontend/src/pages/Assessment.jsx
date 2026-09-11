import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentAPI } from "../api/resources";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const QUESTIONS = {
  en: [
    {
      key: "learning_goal",
      question: "Why do you want to learn this language?",
      options: [
        "For education or studies",
        "For work or career",
        "To communicate with family or friends",
        "For travel and daily life",
        "To improve reading and writing",
      ],
    },
    {
      key: "language_exposure",
      question: "How much exposure have you had to this language?",
      options: [
        "I am completely new to it",
        "I know a few words",
        "I understand common words",
        "I understand simple sentences",
        "I use the language regularly",
      ],
    },
    {
      key: "reading_level",
      question: "How much can you read in this language?",
      options: [
        "I cannot read it yet",
        "I recognize a few letters or characters",
        "I can read some words",
        "I can read simple sentences",
        "I can read paragraphs",
      ],
    },
    {
      key: "writing_level",
      question: "How much can you write in this language?",
      options: [
        "I cannot write it yet",
        "I can write a few letters or characters",
        "I can write some words",
        "I can write simple sentences",
        "I can write comfortably",
      ],
    },
    {
      key: "comprehension_level",
      question: "How much can you understand when someone speaks this language?",
      options: [
        "I do not understand it",
        "I understand a few words",
        "I understand common phrases",
        "I understand simple conversations",
        "I understand most everyday conversations",
      ],
    },
  ],

  hi: [
    {
      key: "learning_goal",
      question: "आप यह भाषा क्यों सीखना चाहते हैं?",
      options: [
        "शिक्षा या पढ़ाई के लिए",
        "काम या करियर के लिए",
        "परिवार या दोस्तों से बात करने के लिए",
        "यात्रा और दैनिक जीवन के लिए",
        "पढ़ने और लिखने में सुधार के लिए",
      ],
    },
    {
      key: "language_exposure",
      question: "आपको इस भाषा का कितना अनुभव है?",
      options: [
        "मैं इस भाषा के लिए बिल्कुल नया हूँ",
        "मैं कुछ शब्द जानता हूँ",
        "मैं सामान्य शब्द समझता हूँ",
        "मैं सरल वाक्य समझता हूँ",
        "मैं इस भाषा का नियमित रूप से उपयोग करता हूँ",
      ],
    },
    {
      key: "reading_level",
      question: "आप इस भाषा में कितना पढ़ सकते हैं?",
      options: [
        "मैं अभी पढ़ नहीं सकता",
        "मैं कुछ अक्षर पहचान सकता हूँ",
        "मैं कुछ शब्द पढ़ सकता हूँ",
        "मैं सरल वाक्य पढ़ सकता हूँ",
        "मैं अनुच्छेद पढ़ सकता हूँ",
      ],
    },
    {
      key: "writing_level",
      question: "आप इस भाषा में कितना लिख सकते हैं?",
      options: [
        "मैं अभी लिख नहीं सकता",
        "मैं कुछ अक्षर लिख सकता हूँ",
        "मैं कुछ शब्द लिख सकता हूँ",
        "मैं सरल वाक्य लिख सकता हूँ",
        "मैं आराम से लिख सकता हूँ",
      ],
    },
    {
      key: "comprehension_level",
      question: "जब कोई इस भाषा में बोलता है तो आप कितना समझ सकते हैं?",
      options: [
        "मैं इसे नहीं समझता",
        "मैं कुछ शब्द समझता हूँ",
        "मैं सामान्य वाक्यांश समझता हूँ",
        "मैं सरल बातचीत समझता हूँ",
        "मैं रोज़मर्रा की अधिकांश बातचीत समझता हूँ",
      ],
    },
  ],

  kn: [
    {
      key: "learning_goal",
      question: "ನೀವು ಈ ಭಾಷೆಯನ್ನು ಏಕೆ ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?",
      options: [
        "ಶಿಕ್ಷಣ ಅಥವಾ ಅಧ್ಯಯನಕ್ಕಾಗಿ",
        "ಕೆಲಸ ಅಥವಾ ವೃತ್ತಿಗಾಗಿ",
        "ಕುಟುಂಬ ಅಥವಾ ಸ್ನೇಹಿತರೊಂದಿಗೆ ಮಾತನಾಡಲು",
        "ಪ್ರಯಾಣ ಮತ್ತು ದೈನಂದಿನ ಜೀವನಕ್ಕಾಗಿ",
        "ಓದು ಮತ್ತು ಬರವಣಿಗೆಯನ್ನು ಸುಧಾರಿಸಲು",
      ],
    },
    {
      key: "language_exposure",
      question: "ಈ ಭಾಷೆಯೊಂದಿಗೆ ನಿಮಗೆ ಎಷ್ಟು ಪರಿಚಯವಿದೆ?",
      options: [
        "ನಾನು ಈ ಭಾಷೆಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಹೊಸಬನು",
        "ನನಗೆ ಕೆಲವು ಪದಗಳು ಗೊತ್ತಿವೆ",
        "ನಾನು ಸಾಮಾನ್ಯ ಪದಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
        "ನಾನು ಸರಳ ವಾಕ್ಯಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
        "ನಾನು ಈ ಭಾಷೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಬಳಸುತ್ತೇನೆ",
      ],
    },
    {
      key: "reading_level",
      question: "ಈ ಭಾಷೆಯಲ್ಲಿ ನೀವು ಎಷ್ಟು ಓದಬಹುದು?",
      options: [
        "ನಾನು ಇನ್ನೂ ಓದಲು ಸಾಧ್ಯವಿಲ್ಲ",
        "ನಾನು ಕೆಲವು ಅಕ್ಷರಗಳನ್ನು ಗುರುತಿಸಬಲ್ಲೆ",
        "ನಾನು ಕೆಲವು ಪದಗಳನ್ನು ಓದಬಲ್ಲೆ",
        "ನಾನು ಸರಳ ವಾಕ್ಯಗಳನ್ನು ಓದಬಲ್ಲೆ",
        "ನಾನು ಪ್ಯಾರಾಗ್ರಾಫ್‌ಗಳನ್ನು ಓದಬಲ್ಲೆ",
      ],
    },
    {
      key: "writing_level",
      question: "ಈ ಭಾಷೆಯಲ್ಲಿ ನೀವು ಎಷ್ಟು ಬರೆಯಬಹುದು?",
      options: [
        "ನಾನು ಇನ್ನೂ ಬರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ",
        "ನಾನು ಕೆಲವು ಅಕ್ಷರಗಳನ್ನು ಬರೆಯಬಲ್ಲೆ",
        "ನಾನು ಕೆಲವು ಪದಗಳನ್ನು ಬರೆಯಬಲ್ಲೆ",
        "ನಾನು ಸರಳ ವಾಕ್ಯಗಳನ್ನು ಬರೆಯಬಲ್ಲೆ",
        "ನಾನು ಸುಲಭವಾಗಿ ಬರೆಯಬಲ್ಲೆ",
      ],
    },
    {
      key: "comprehension_level",
      question: "ಯಾರಾದರೂ ಈ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿದಾಗ ನೀವು ಎಷ್ಟು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಹುದು?",
      options: [
        "ನನಗೆ ಅರ್ಥವಾಗುವುದಿಲ್ಲ",
        "ನಾನು ಕೆಲವು ಪದಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
        "ನಾನು ಸಾಮಾನ್ಯ ಪದಗುಚ್ಛಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
        "ನಾನು ಸರಳ ಸಂಭಾಷಣೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
        "ನಾನು ದೈನಂದಿನ ಹೆಚ್ಚಿನ ಸಂಭಾಷಣೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ",
      ],
    },
  ],

  te: [
    {
      key: "learning_goal",
      question: "మీరు ఈ భాషను ఎందుకు నేర్చుకోవాలనుకుంటున్నారు?",
      options: [
        "విద్య లేదా చదువుల కోసం",
        "పని లేదా కెరీర్ కోసం",
        "కుటుంబం లేదా స్నేహితులతో మాట్లాడటానికి",
        "ప్రయాణం మరియు రోజువారీ జీవితం కోసం",
        "చదవడం మరియు రాయడం మెరుగుపరచడానికి",
      ],
    },
    {
      key: "language_exposure",
      question: "ఈ భాషతో మీకు ఎంత పరిచయం ఉంది?",
      options: [
        "నేను ఈ భాషకు పూర్తిగా కొత్తవాడిని",
        "నాకు కొన్ని పదాలు తెలుసు",
        "నేను సాధారణ పదాలను అర్థం చేసుకోగలను",
        "నేను సరళమైన వాక్యాలను అర్థం చేసుకోగలను",
        "నేను ఈ భాషను క్రమం తప్పకుండా ఉపయోగిస్తాను",
      ],
    },
    {
      key: "reading_level",
      question: "ఈ భాషలో మీరు ఎంత చదవగలరు?",
      options: [
        "నేను ఇంకా చదవలేను",
        "నేను కొన్ని అక్షరాలను గుర్తించగలను",
        "నేను కొన్ని పదాలను చదవగలను",
        "నేను సరళమైన వాక్యాలను చదవగలను",
        "నేను పేరాగ్రాఫ్‌లను చదవగలను",
      ],
    },
    {
      key: "writing_level",
      question: "ఈ భాషలో మీరు ఎంత రాయగలరు?",
      options: [
        "నేను ఇంకా రాయలేను",
        "నేను కొన్ని అక్షరాలను రాయగలను",
        "నేను కొన్ని పదాలను రాయగలను",
        "నేను సరళమైన వాక్యాలను రాయగలను",
        "నేను సౌకర్యంగా రాయగలను",
      ],
    },
    {
      key: "comprehension_level",
      question: "ఎవరైనా ఈ భాషలో మాట్లాడితే మీరు ఎంత అర్థం చేసుకోగలరు?",
      options: [
        "నాకు అర్థం కాదు",
        "నేను కొన్ని పదాలను అర్థం చేసుకుంటాను",
        "నేను సాధారణ పదబంధాలను అర్థం చేసుకుంటాను",
        "నేను సరళమైన సంభాషణలను అర్థం చేసుకుంటాను",
        "నేను రోజువారీ సంభాషణలను ఎక్కువగా అర్థం చేసుకుంటాను",
      ],
    },
  ],

  ta: [
    {
      key: "learning_goal",
      question: "நீங்கள் ஏன் இந்த மொழியைக் கற்க விரும்புகிறீர்கள்?",
      options: [
        "கல்வி அல்லது படிப்பிற்காக",
        "வேலை அல்லது தொழிலுக்காக",
        "குடும்பம் அல்லது நண்பர்களுடன் பேசுவதற்காக",
        "பயணம் மற்றும் அன்றாட வாழ்க்கைக்காக",
        "படித்தல் மற்றும் எழுதுதலை மேம்படுத்துவதற்காக",
      ],
    },
    {
      key: "language_exposure",
      question: "இந்த மொழியில் உங்களுக்கு எவ்வளவு அனுபவம் உள்ளது?",
      options: [
        "இந்த மொழிக்கு நான் முற்றிலும் புதியவன்",
        "எனக்கு சில வார்த்தைகள் தெரியும்",
        "எனக்கு பொதுவான வார்த்தைகள் புரியும்",
        "எனக்கு எளிய வாக்கியங்கள் புரியும்",
        "நான் இந்த மொழியை தொடர்ந்து பயன்படுத்துகிறேன்",
      ],
    },
    {
      key: "reading_level",
      question: "இந்த மொழியில் நீங்கள் எவ்வளவு படிக்க முடியும்?",
      options: [
        "என்னால் இன்னும் படிக்க முடியாது",
        "சில எழுத்துகளை அடையாளம் காண முடியும்",
        "சில வார்த்தைகளைப் படிக்க முடியும்",
        "எளிய வாக்கியங்களைப் படிக்க முடியும்",
        "பத்திகளைப் படிக்க முடியும்",
      ],
    },
    {
      key: "writing_level",
      question: "இந்த மொழியில் நீங்கள் எவ்வளவு எழுத முடியும்?",
      options: [
        "என்னால் இன்னும் எழுத முடியாது",
        "சில எழுத்துகளை எழுத முடியும்",
        "சில வார்த்தைகளை எழுத முடியும்",
        "எளிய வாக்கியங்களை எழுத முடியும்",
        "சௌகரியமாக எழுத முடியும்",
      ],
    },
    {
      key: "comprehension_level",
      question: "யாராவது இந்த மொழியில் பேசும்போது நீங்கள் எவ்வளவு புரிந்துகொள்ள முடியும்?",
      options: [
        "எனக்கு புரியாது",
        "சில வார்த்தைகள் புரியும்",
        "பொதுவான சொற்றொடர்கள் புரியும்",
        "எளிய உரையாடல்கள் புரியும்",
        "அன்றாட உரையாடல்களில் பெரும்பாலானவை புரியும்",
      ],
    },
  ],
};

const UI_TEXT = {
  en: {
    title: "Let's find your starting level",
    subtitle:
      "Answer 5 quick questions so Akshara can personalize your learning path.",
    question: "Question",
    of: "of",
    back: "Back",
    next: "Continue",
    finish: "Finish assessment",
    submitting: "Saving...",
    resultTitle: "Your starting level",
    score: "Profile score",
    startLearning: "Start learning",
    loginRequired: "Please log in before taking the assessment.",
    error: "Something went wrong. Please try again.",
  },

  hi: {
    title: "आइए आपका शुरुआती स्तर जानें",
    subtitle:
      "5 छोटे प्रश्नों के उत्तर दें ताकि अक्षरा आपके लिए सीखने का मार्ग तैयार कर सके।",
    question: "प्रश्न",
    of: "में से",
    back: "वापस",
    next: "जारी रखें",
    finish: "मूल्यांकन पूरा करें",
    submitting: "सहेजा जा रहा है...",
    resultTitle: "आपका शुरुआती स्तर",
    score: "प्रोफ़ाइल स्कोर",
    startLearning: "सीखना शुरू करें",
    loginRequired: "मूल्यांकन करने से पहले कृपया लॉगिन करें।",
    error: "कुछ गलत हुआ। कृपया फिर से प्रयास करें।",
  },

  kn: {
    title: "ನಿಮ್ಮ ಆರಂಭಿಕ ಮಟ್ಟವನ್ನು ತಿಳಿದುಕೊಳ್ಳೋಣ",
    subtitle:
      "5 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ. ಅಕ್ಷರಾ ನಿಮ್ಮ ಕಲಿಕೆಯ ಮಾರ್ಗವನ್ನು ವೈಯಕ್ತೀಕರಿಸುತ್ತದೆ.",
    question: "ಪ್ರಶ್ನೆ",
    of: "ರಲ್ಲಿ",
    back: "ಹಿಂದೆ",
    next: "ಮುಂದುವರಿಸಿ",
    finish: "ಮೌಲ್ಯಮಾಪನ ಪೂರ್ಣಗೊಳಿಸಿ",
    submitting: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    resultTitle: "ನಿಮ್ಮ ಆರಂಭಿಕ ಮಟ್ಟ",
    score: "ಪ್ರೊಫೈಲ್ ಅಂಕ",
    startLearning: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ",
    loginRequired: "ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ.",
    error: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  },

  te: {
    title: "మీ ప్రారంభ స్థాయిని తెలుసుకుందాం",
    subtitle:
      "5 చిన్న ప్రశ్నలకు సమాధానం ఇవ్వండి. అక్షరా మీ అభ్యాస మార్గాన్ని వ్యక్తిగతీకరిస్తుంది.",
    question: "ప్రశ్న",
    of: "లో",
    back: "వెనుకకు",
    next: "కొనసాగించండి",
    finish: "మూల్యాంకనం పూర్తి చేయండి",
    submitting: "సేవ్ చేస్తోంది...",
    resultTitle: "మీ ప్రారంభ స్థాయి",
    score: "ప్రొఫైల్ స్కోర్",
    startLearning: "నేర్చుకోవడం ప్రారంభించండి",
    loginRequired: "మూల్యాంకనం చేయడానికి ముందుగా లాగిన్ చేయండి.",
    error: "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
  },

  ta: {
    title: "உங்கள் தொடக்க நிலையை அறிந்துகொள்வோம்",
    subtitle:
      "5 எளிய கேள்விகளுக்கு பதிலளிக்கவும். அக்ஷரா உங்கள் கற்றல் பாதையை தனிப்பயனாக்கும்.",
    question: "கேள்வி",
    of: "இல்",
    back: "பின்செல்",
    next: "தொடரவும்",
    finish: "மதிப்பீட்டை முடிக்கவும்",
    submitting: "சேமிக்கப்படுகிறது...",
    resultTitle: "உங்கள் தொடக்க நிலை",
    score: "சுயவிவர மதிப்பெண்",
    startLearning: "கற்றலைத் தொடங்குங்கள்",
    loginRequired: "மதிப்பீட்டை தொடங்குவதற்கு முன் உள்நுழையவும்.",
    error: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
  },
};

export default function Assessment() {
  const navigate = useNavigate();
  const { learner } = useAuth();
  const { language } = useLanguage();

  const ui = UI_TEXT[language] || UI_TEXT.en;
  const questions = QUESTIONS[language] || QUESTIONS.en;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const question = questions[currentQuestion];
  const selectedAnswer = answers[question.key];

  const chooseAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [question.key]: answer,
    }));

    setError("");
  };

  const goNext = () => {
    if (!selectedAnswer) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  const submitAssessment = async () => {
    if (!learner) {
      setError(ui.loginRequired);
      return;
    }

    if (questions.some((item) => !answers[item.key])) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        learning_goal: answers.learning_goal,
        language_exposure: answers.language_exposure,
        reading_level: answers.reading_level,
        writing_level: answers.writing_level,
        comprehension_level: answers.comprehension_level,
        learning_language: learner.learning_language,
      };

      const response = await AssessmentAPI.initialAssessment(payload);

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          ui.error
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <main className="page-shell">
        <section className="assessment-result-card">
          <div className="assessment-result-icon">✓</div>

          <h1>{ui.resultTitle}</h1>

          <div className="assessment-level">
            {result.starting_level}
          </div>

          <p>
            {ui.score}: {result.score} / {result.maximum_score}
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/learn")}
          >
            {ui.startLearning}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="assessment-page">
        <div className="assessment-header">
          <div className="assessment-progress">
            <div
              className="assessment-progress-bar"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>

          <p className="assessment-counter">
            {ui.question} {currentQuestion + 1} {ui.of}{" "}
            {questions.length}
          </p>

          <h1>{ui.title}</h1>

          <p className="assessment-subtitle">
            {ui.subtitle}
          </p>
        </div>

        <div className="assessment-question-card">
          <h2>{question.question}</h2>

          <div className="assessment-options">
            {question.options.map((option) => {
              const selected =
                selectedAnswer === option;

              return (
                <button
                  key={option}
                  type="button"
                  className={
                    selected
                      ? "assessment-option selected"
                      : "assessment-option"
                  }
                  onClick={() =>
                    chooseAnswer(option)
                  }
                >
                  <span className="assessment-option-radio">
                    {selected ? "✓" : ""}
                  </span>

                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="assessment-error">
            {error}
          </div>
        )}

        <div className="assessment-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={goBack}
            disabled={currentQuestion === 0}
          >
            {ui.back}
          </button>

          {currentQuestion <
          questions.length - 1 ? (
            <button
              type="button"
              className="primary-btn"
              onClick={goNext}
              disabled={!selectedAnswer}
            >
              {ui.next}
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={submitAssessment}
              disabled={
                !selectedAnswer || submitting
              }
            >
              {submitting
                ? ui.submitting
                : ui.finish}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}