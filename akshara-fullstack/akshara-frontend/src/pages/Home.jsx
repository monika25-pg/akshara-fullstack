import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const HOME_TEXT = {
  en: {
    eyebrow: "AI-based literacy assistance",
    readWrite: "Read. Write.",
    seekho: "Learn",
    pace: "at your pace.",
    lede:
      "An adaptive platform that meets every neo-learner where they are — self-paced reading, writing and comprehension practice in the language they know best, with recommendations that adjust as skills grow.",
    startLearning: "Start learning →",
    dashboard: "Go to dashboard →",
    proficiency: "View proficiency levels",
    todaysFocus: "TODAY'S FOCUS",
    vocabulary: "Vocabulary + Comprehension",
    level: "Level: Emerging Reader · 42% weekly goal",

    supportEyebrow: "01 · What we support",
    supportTitle: "Six building blocks of a literacy learning journey",
    supportDesc:
      "Each is designed for learners who are new to reading and writing — short activities, audio support, and content available in the learner's own language.",

    readingTag: "READING",
    readingTitle: "Reading content",
    readingDesc:
      "Levelled passages with word highlighting and read-aloud support.",

    writingTag: "WRITING",
    writingTitle: "Writing exercises",
    writingDesc:
      "Letter tracing, word formation and guided sentence writing.",

    vocabularyTag: "VOCABULARY",
    vocabularyTitle: "Vocabulary building",
    vocabularyDesc:
      "Picture-linked word cards with native-language translation.",

    comprehensionTag: "COMPREHENSION",
    comprehensionTitle: "Comprehension checks",
    comprehensionDesc:
      "Short passages followed by simple recall and inference questions.",

    practiceTag: "PRACTICE",
    practiceTitle: "Practice activities",
    practiceDesc:
      "Spaced-repetition drills that adapt to a learner's weak areas.",

    multilingualTag: "MULTILINGUAL",
    multilingualTitle: "Multilingual content",
    multilingualDesc:
      "Every lesson is available in the learner's chosen learning language.",

    journeyEyebrow: "02 · How a learner moves through it",
    journeyTitle:
      "Registration → placement → adaptive learning → recommendation",

    step1: "STEP 1",
    step1Title: "Register & profile",
    step1Desc:
      "Basic information, learning language and a quick proficiency check.",

    step2: "STEP 2",
    step2Title: "Placement",
    step2Desc:
      "A short assessment places the learner into one of four levels.",

    step3: "STEP 3",
    step3Title: "Guided lessons",
    step3Desc:
      "Reading, writing, vocabulary and comprehension in sequence.",

    step4: "STEP 4",
    step4Title: "Recommendations",
    step4Desc:
      "The system suggests the next best lesson from performance data.",

    footer:
      "AKSHARA · AI-BASED INTELLIGENT LITERACY ASSISTANCE PLATFORM",
  },

  hi: {
    eyebrow: "AI आधारित साक्षरता सहायता",
    readWrite: "पढ़ें। लिखें।",
    seekho: "सीखें",
    pace: "अपनी गति से।",
    lede:
      "एक अनुकूलनशील मंच जो हर नए शिक्षार्थी को उसके वर्तमान स्तर से सीखने में सहायता करता है — अपनी गति से पढ़ने, लिखने और समझने का अभ्यास, उस भाषा में जिसे वह सबसे अच्छी तरह समझता है, और कौशल बढ़ने के साथ बदलती सीखने की सिफारिशें।",
    startLearning: "सीखना शुरू करें →",
    dashboard: "डैशबोर्ड पर जाएँ →",
    proficiency: "दक्षता के स्तर देखें",
    todaysFocus: "आज का अभ्यास",
    vocabulary: "शब्दावली + समझ",
    level: "स्तर: प्रारंभिक पाठक · साप्ताहिक लक्ष्य 42%",

    supportEyebrow: "01 · हम क्या सिखाते हैं",
    supportTitle: "साक्षरता सीखने की यात्रा के छह आधार",
    supportDesc:
      "हर भाग उन शिक्षार्थियों के लिए बनाया गया है जो पढ़ना और लिखना सीखना शुरू कर रहे हैं — छोटी गतिविधियाँ, ऑडियो सहायता और शिक्षार्थी की अपनी भाषा में उपलब्ध सामग्री।",

    readingTag: "पठन",
    readingTitle: "पठन सामग्री",
    readingDesc:
      "शब्दों को हाइलाइट करने और ज़ोर से पढ़ने की सुविधा वाली स्तरानुसार सामग्री।",

    writingTag: "लेखन",
    writingTitle: "लेखन अभ्यास",
    writingDesc:
      "अक्षर लिखने का अभ्यास, शब्द निर्माण और निर्देशित वाक्य लेखन।",

    vocabularyTag: "शब्दावली",
    vocabularyTitle: "शब्दावली निर्माण",
    vocabularyDesc:
      "चित्रों से जुड़े शब्द कार्ड और मातृभाषा में अनुवाद।",

    comprehensionTag: "समझ",
    comprehensionTitle: "समझ की जाँच",
    comprehensionDesc:
      "छोटे पाठों के बाद सरल स्मरण और समझ पर आधारित प्रश्न।",

    practiceTag: "अभ्यास",
    practiceTitle: "अभ्यास गतिविधियाँ",
    practiceDesc:
      "बार-बार अभ्यास वाली गतिविधियाँ जो शिक्षार्थी के कमजोर क्षेत्रों के अनुसार बदलती हैं।",

    multilingualTag: "बहुभाषी",
    multilingualTitle: "बहुभाषी सामग्री",
    multilingualDesc:
      "हर पाठ शिक्षार्थी की चुनी हुई सीखने की भाषा में उपलब्ध है।",

    journeyEyebrow: "02 · शिक्षार्थी की सीखने की प्रक्रिया",
    journeyTitle:
      "पंजीकरण → स्तर निर्धारण → अनुकूलित सीखना → सिफारिश",

    step1: "चरण 1",
    step1Title: "पंजीकरण और प्रोफ़ाइल",
    step1Desc:
      "मूल जानकारी, सीखने की भाषा और त्वरित दक्षता जाँच।",

    step2: "चरण 2",
    step2Title: "स्तर निर्धारण",
    step2Desc:
      "एक छोटा मूल्यांकन शिक्षार्थी को चार स्तरों में से एक स्तर देता है।",

    step3: "चरण 3",
    step3Title: "निर्देशित पाठ",
    step3Desc:
      "पठन, लेखन, शब्दावली और समझ का क्रमबद्ध अभ्यास।",

    step4: "चरण 4",
    step4Title: "सिफारिशें",
    step4Desc:
      "प्रदर्शन के आधार पर सिस्टम अगला सबसे उपयोगी पाठ सुझाता है।",

    footer:
      "अक्षरा · AI आधारित बुद्धिमान साक्षरता सहायता मंच",
  },

  kn: {
    eyebrow: "AI ಆಧಾರಿತ ಸಾಕ್ಷರತಾ ಸಹಾಯ",
    readWrite: "ಓದಿ. ಬರೆಯಿರಿ.",
    seekho: "ಕಲಿಯಿರಿ",
    pace: "ನಿಮ್ಮ ವೇಗದಲ್ಲಿ.",
    lede:
      "ಪ್ರತಿ ಹೊಸ ಕಲಿಯುವವರಿಗೆ ಅವರ ಮಟ್ಟಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಸಹಾಯ ಮಾಡುವ ಹೊಂದಿಕೊಳ್ಳುವ ವೇದಿಕೆ — ಅವರಿಗೆ ಚೆನ್ನಾಗಿ ತಿಳಿದಿರುವ ಭಾಷೆಯಲ್ಲಿ ಓದು, ಬರಹ ಮತ್ತು ಅರ್ಥಗ್ರಹಣದ ಸ್ವಯಂ ವೇಗದ ಅಭ್ಯಾಸ, ಹಾಗೂ ಕೌಶಲ್ಯಗಳು ಬೆಳೆಯುತ್ತಿದ್ದಂತೆ ಬದಲಾಗುವ ಶಿಫಾರಸುಗಳು.",
    startLearning: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ →",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ →",
    proficiency: "ಪ್ರಾವೀಣ್ಯತೆಯ ಮಟ್ಟಗಳನ್ನು ನೋಡಿ",
    todaysFocus: "ಇಂದಿನ ಅಭ್ಯಾಸ",
    vocabulary: "ಪದಸಂಪತ್ತು + ಅರ್ಥಗ್ರಹಣ",
    level: "ಮಟ್ಟ: ಆರಂಭಿಕ ಓದುಗ · ವಾರದ ಗುರಿ 42%",

    supportEyebrow: "01 · ನಾವು ಏನು ಕಲಿಸುತ್ತೇವೆ",
    supportTitle: "ಸಾಕ್ಷರತಾ ಕಲಿಕೆಯ ಪ್ರಯಾಣದ ಆರು ಮುಖ್ಯ ಭಾಗಗಳು",
    supportDesc:
      "ಓದಲು ಮತ್ತು ಬರೆಯಲು ಹೊಸದಾಗಿ ಕಲಿಯುತ್ತಿರುವವರಿಗೆ ಪ್ರತಿಯೊಂದು ಭಾಗವನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ — ಚಿಕ್ಕ ಚಟುವಟಿಕೆಗಳು, ಆಡಿಯೋ ಸಹಾಯ ಮತ್ತು ಕಲಿಯುವವರ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿನ ವಿಷಯ।",

    readingTag: "ಓದು",
    readingTitle: "ಓದುವ ವಿಷಯ",
    readingDesc:
      "ಪದಗಳನ್ನು ಹೈಲೈಟ್ ಮಾಡುವ ಮತ್ತು ಜೋರಾಗಿ ಓದುವ ಸಹಾಯವಿರುವ ಮಟ್ಟಕ್ಕೆ ಅನುಗುಣವಾದ ಪಾಠಗಳು.",

    writingTag: "ಬರಹ",
    writingTitle: "ಬರಹದ ಅಭ್ಯಾಸಗಳು",
    writingDesc:
      "ಅಕ್ಷರ ಬರೆಯುವ ಅಭ್ಯಾಸ, ಪದ ರಚನೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿತ ವಾಕ್ಯ ಬರಹ.",

    vocabularyTag: "ಪದಸಂಪತ್ತು",
    vocabularyTitle: "ಪದಸಂಪತ್ತು ನಿರ್ಮಾಣ",
    vocabularyDesc:
      "ಚಿತ್ರಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಪದ ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಭಾಷೆಯ ಅನುವಾದ.",

    comprehensionTag: "ಅರ್ಥಗ್ರಹಣ",
    comprehensionTitle: "ಅರ್ಥಗ್ರಹಣ ಪರಿಶೀಲನೆ",
    comprehensionDesc:
      "ಚಿಕ್ಕ ಪಾಠಗಳ ನಂತರ ಸರಳ ನೆನಪು ಮತ್ತು ಅರ್ಥಗ್ರಹಣ ಪ್ರಶ್ನೆಗಳು.",

    practiceTag: "ಅಭ್ಯಾಸ",
    practiceTitle: "ಅಭ್ಯಾಸ ಚಟುವಟಿಕೆಗಳು",
    practiceDesc:
      "ಕಲಿಯುವವರ ದುರ್ಬಲ ಭಾಗಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಬದಲಾಗುವ ಪುನರಾವರ್ತಿತ ಅಭ್ಯಾಸಗಳು.",

    multilingualTag: "ಬಹುಭಾಷಾ",
    multilingualTitle: "ಬಹುಭಾಷಾ ವಿಷಯ",
    multilingualDesc:
      "ಪ್ರತಿ ಪಾಠವೂ ಕಲಿಯುವವರು ಆಯ್ಕೆ ಮಾಡಿದ ಕಲಿಕೆಯ ಭಾಷೆಯಲ್ಲಿ ಲಭ್ಯವಿದೆ.",

    journeyEyebrow: "02 · ಕಲಿಯುವವರು ಹೇಗೆ ಕಲಿಯುತ್ತಾರೆ",
    journeyTitle:
      "ನೋಂದಣಿ → ಮಟ್ಟ ನಿರ್ಧಾರ → ಹೊಂದಿಕೊಳ್ಳುವ ಕಲಿಕೆ → ಶಿಫಾರಸು",

    step1: "ಹಂತ 1",
    step1Title: "ನೋಂದಣಿ ಮತ್ತು ಪ್ರೊಫೈಲ್",
    step1Desc:
      "ಮೂಲ ಮಾಹಿತಿ, ಕಲಿಕೆಯ ಭಾಷೆ ಮತ್ತು ತ್ವರಿತ ಪ್ರಾವೀಣ್ಯತಾ ಪರಿಶೀಲನೆ.",

    step2: "ಹಂತ 2",
    step2Title: "ಮಟ್ಟ ನಿರ್ಧಾರ",
    step2Desc:
      "ಚಿಕ್ಕ ಮೌಲ್ಯಮಾಪನವು ಕಲಿಯುವವರನ್ನು ನಾಲ್ಕು ಮಟ್ಟಗಳಲ್ಲಿ ಒಂದಕ್ಕೆ ಸೇರಿಸುತ್ತದೆ.",

    step3: "ಹಂತ 3",
    step3Title: "ಮಾರ್ಗದರ್ಶಿತ ಪಾಠಗಳು",
    step3Desc:
      "ಓದು, ಬರಹ, ಪದಸಂಪತ್ತು ಮತ್ತು ಅರ್ಥಗ್ರಹಣದ ಕ್ರಮಬದ್ಧ ಅಭ್ಯಾಸ.",

    step4: "ಹಂತ 4",
    step4Title: "ಶಿಫಾರಸುಗಳು",
    step4Desc:
      "ಕಾರ್ಯಕ್ಷಮತೆಯ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಮುಂದಿನ ಉತ್ತಮ ಪಾಠವನ್ನು ವ್ಯವಸ್ಥೆ ಸೂಚಿಸುತ್ತದೆ.",

    footer:
      "ಅಕ್ಷರ · AI ಆಧಾರಿತ ಬುದ್ಧಿವಂತ ಸಾಕ್ಷರತಾ ಸಹಾಯ ವೇದಿಕೆ",
  },

  te: {
    eyebrow: "AI ఆధారిత అక్షరాస్యత సహాయం",
    readWrite: "చదవండి. రాయండి.",
    seekho: "నేర్చుకోండి",
    pace: "మీ వేగంలో.",
    lede:
      "ప్రతి కొత్త అభ్యాసకుడి స్థాయికి అనుగుణంగా సహాయపడే అనుకూల వేదిక — వారికి బాగా తెలిసిన భాషలో స్వయంగా చదవడం, రాయడం మరియు అర్థం చేసుకోవడం సాధన, నైపుణ్యాలు పెరుగుతున్న కొద్దీ మారే సిఫార్సులతో.",
    startLearning: "నేర్చుకోవడం ప్రారంభించండి →",
    dashboard: "డ్యాష్‌బోర్డ్‌కు వెళ్లండి →",
    proficiency: "నైపుణ్య స్థాయిలను చూడండి",
    todaysFocus: "ఈరోజు సాధన",
    vocabulary: "పదజాలం + అవగాహన",
    level: "స్థాయి: ప్రారంభ పాఠకుడు · వారపు లక్ష్యం 42%",

    supportEyebrow: "01 · మేము ఏమి నేర్పుతాము",
    supportTitle: "అక్షరాస్యత అభ్యాస ప్రయాణంలోని ఆరు ముఖ్య భాగాలు",
    supportDesc:
      "చదవడం మరియు రాయడం కొత్తగా నేర్చుకుంటున్న అభ్యాసకుల కోసం ప్రతి భాగాన్ని రూపొందించాం — చిన్న కార్యకలాపాలు, ఆడియో సహాయం మరియు అభ్యాసకుడి స్వంత భాషలో అందుబాటులో ఉన్న కంటెంట్.",

    readingTag: "చదవడం",
    readingTitle: "పఠన కంటెంట్",
    readingDesc:
      "పదాలను హైలైట్ చేయడం మరియు గట్టిగా చదివే సహాయంతో స్థాయికి అనుగుణమైన పాఠాలు.",

    writingTag: "రాయడం",
    writingTitle: "రచనా వ్యాయామాలు",
    writingDesc:
      "అక్షరాల రాత సాధన, పద నిర్మాణం మరియు మార్గదర్శక వాక్య రచన.",

    vocabularyTag: "పదజాలం",
    vocabularyTitle: "పదజాల నిర్మాణం",
    vocabularyDesc:
      "చిత్రాలతో అనుసంధానమైన పద కార్డులు మరియు స్థానిక భాషలో అనువాదం.",

    comprehensionTag: "అవగాహన",
    comprehensionTitle: "అవగాహన తనిఖీలు",
    comprehensionDesc:
      "చిన్న పాఠాల తర్వాత సులభమైన గుర్తింపు మరియు అర్థగ్రహణ ప్రశ్నలు.",

    practiceTag: "సాధన",
    practiceTitle: "సాధన కార్యకలాపాలు",
    practiceDesc:
      "అభ్యాసకుడి బలహీన ప్రాంతాలకు అనుగుణంగా మారే పునరావృత సాధన కార్యకలాపాలు.",

    multilingualTag: "బహుభాషా",
    multilingualTitle: "బహుభాషా కంటెంట్",
    multilingualDesc:
      "ప్రతి పాఠం అభ్యాసకుడు ఎంచుకున్న నేర్చుకునే భాషలో అందుబాటులో ఉంటుంది.",

    journeyEyebrow: "02 · అభ్యాసకుడు ఎలా ముందుకు సాగుతాడు",
    journeyTitle:
      "నమోదు → స్థాయి నిర్ధారణ → అనుకూల అభ్యాసం → సిఫార్సు",

    step1: "దశ 1",
    step1Title: "నమోదు మరియు ప్రొఫైల్",
    step1Desc:
      "ప్రాథమిక సమాచారం, నేర్చుకునే భాష మరియు త్వరిత నైపుణ్య తనిఖీ.",

    step2: "దశ 2",
    step2Title: "స్థాయి నిర్ధారణ",
    step2Desc:
      "చిన్న మూల్యాంకనం అభ్యాసకుడిని నాలుగు స్థాయిలలో ఒకదానిలో ఉంచుతుంది.",

    step3: "దశ 3",
    step3Title: "మార్గదర్శక పాఠాలు",
    step3Desc:
      "చదవడం, రాయడం, పదజాలం మరియు అవగాహనను క్రమంగా సాధన చేయడం.",

    step4: "దశ 4",
    step4Title: "సిఫార్సులు",
    step4Desc:
      "పనితీరు ఆధారంగా తదుపరి ఉత్తమ పాఠాన్ని వ్యవస్థ సూచిస్తుంది.",

    footer:
      "అక్షర · AI ఆధారిత తెలివైన అక్షరాస్యత సహాయ వేదిక",
  },

  ta: {
    eyebrow: "AI அடிப்படையிலான எழுத்தறிவு உதவி",
    readWrite: "படிக்கவும். எழுதவும்.",
    seekho: "கற்றுக்கொள்ளுங்கள்",
    pace: "உங்கள் வேகத்தில்.",
    lede:
      "ஒவ்வொரு புதிய கற்றலாளரின் நிலையையும் கருத்தில் கொண்டு உதவும் தகவமைப்பு தளம் — அவர்கள் நன்றாக அறிந்த மொழியில் சுயவேக வாசிப்பு, எழுத்து மற்றும் புரிதல் பயிற்சி, மேலும் திறன்கள் வளரும்போது மாறும் பரிந்துரைகள்.",
    startLearning: "கற்றலைத் தொடங்குங்கள் →",
    dashboard: "டாஷ்போர்டுக்குச் செல்லுங்கள் →",
    proficiency: "திறன் நிலைகளைப் பார்க்கவும்",
    todaysFocus: "இன்றைய பயிற்சி",
    vocabulary: "சொல்வளம் + புரிதல்",
    level: "நிலை: தொடக்க வாசகர் · வார இலக்கு 42%",

    supportEyebrow: "01 · நாங்கள் கற்பிப்பவை",
    supportTitle: "எழுத்தறிவு கற்றல் பயணத்தின் ஆறு முக்கிய பகுதிகள்",
    supportDesc:
      "வாசிப்பையும் எழுதுவதையும் புதிதாகக் கற்றுக்கொள்ளும் மாணவர்களுக்காக ஒவ்வொரு பகுதியும் வடிவமைக்கப்பட்டுள்ளது — சிறிய செயல்பாடுகள், ஒலி உதவி மற்றும் கற்றலாளரின் சொந்த மொழியில் உள்ளடக்கம்.",

    readingTag: "வாசிப்பு",
    readingTitle: "வாசிப்பு உள்ளடக்கம்",
    readingDesc:
      "சொல் சிறப்பம்சப்படுத்தல் மற்றும் சத்தமாக வாசிக்கும் உதவியுடன் நிலைக்கு ஏற்ப அமைந்த பகுதிகள்.",

    writingTag: "எழுத்து",
    writingTitle: "எழுத்துப் பயிற்சிகள்",
    writingDesc:
      "எழுத்து எழுதும் பயிற்சி, சொல் உருவாக்கம் மற்றும் வழிகாட்டப்பட்ட வாக்கிய எழுத்து.",

    vocabularyTag: "சொல்வளம்",
    vocabularyTitle: "சொல்வள உருவாக்கம்",
    vocabularyDesc:
      "படங்களுடன் இணைக்கப்பட்ட சொல் அட்டைகள் மற்றும் தாய்மொழி மொழிபெயர்ப்பு.",

    comprehensionTag: "புரிதல்",
    comprehensionTitle: "புரிதல் சரிபார்ப்புகள்",
    comprehensionDesc:
      "சிறிய பகுதிகளுக்குப் பிறகு எளிய நினைவுகூரல் மற்றும் புரிதல் கேள்விகள்.",

    practiceTag: "பயிற்சி",
    practiceTitle: "பயிற்சி செயல்பாடுகள்",
    practiceDesc:
      "கற்றலாளரின் பலவீனமான பகுதிகளுக்கு ஏற்ப மாறும் மீள்பயிற்சி செயல்பாடுகள்.",

    multilingualTag: "பலமொழி",
    multilingualTitle: "பலமொழி உள்ளடக்கம்",
    multilingualDesc:
      "ஒவ்வொரு பாடமும் கற்றலாளர் தேர்ந்தெடுத்த கற்றல் மொழியில் கிடைக்கும்.",

    journeyEyebrow: "02 · கற்றலாளர் எவ்வாறு முன்னேறுகிறார்",
    journeyTitle:
      "பதிவு → நிலை நிர்ணயம் → தகவமைப்பு கற்றல் → பரிந்துரை",

    step1: "படி 1",
    step1Title: "பதிவு மற்றும் சுயவிவரம்",
    step1Desc:
      "அடிப்படை தகவல், கற்றல் மொழி மற்றும் விரைவான திறன் சரிபார்ப்பு.",

    step2: "படி 2",
    step2Title: "நிலை நிர்ணயம்",
    step2Desc:
      "ஒரு சிறிய மதிப்பீடு கற்றலாளரை நான்கு நிலைகளில் ஒன்றில் வைக்கிறது.",

    step3: "படி 3",
    step3Title: "வழிகாட்டப்பட்ட பாடங்கள்",
    step3Desc:
      "வாசிப்பு, எழுத்து, சொல்வளம் மற்றும் புரிதல் ஆகியவற்றை வரிசையாகப் பயிற்சி செய்தல்.",

    step4: "படி 4",
    step4Title: "பரிந்துரைகள்",
    step4Desc:
      "செயல்திறன் தரவின் அடிப்படையில் அடுத்த சிறந்த பாடத்தை அமைப்பு பரிந்துரைக்கிறது.",

    footer:
      "அக்ஷரா · AI அடிப்படையிலான அறிவார்ந்த எழுத்தறிவு உதவி தளம்",
  },
};

export default function Home() {
  const pathRef = useRef(null);
  const { learner } = useAuth();
  const { language } = useLanguage();

  const text = HOME_TEXT[language] || HOME_TEXT.en;

  useEffect(() => {
    const path = pathRef.current;

    if (!path) return;

    const len = path.getTotalLength();

    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;

    path.getBoundingClientRect();

    path.style.transition = "stroke-dashoffset 1.4s ease";

    const timer = setTimeout(() => {
      path.style.strokeDashoffset = "0";
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const blocks = [
    [text.readingTag, text.readingTitle, text.readingDesc],
    [text.writingTag, text.writingTitle, text.writingDesc],
    [text.vocabularyTag, text.vocabularyTitle, text.vocabularyDesc],
    [
      text.comprehensionTag,
      text.comprehensionTitle,
      text.comprehensionDesc,
    ],
    [text.practiceTag, text.practiceTitle, text.practiceDesc],
    [
      text.multilingualTag,
      text.multilingualTitle,
      text.multilingualDesc,
    ],
  ];

  const steps = [
    [text.step1, text.step1Title, text.step1Desc],
    [text.step2, text.step2Title, text.step2Desc],
    [text.step3, text.step3Title, text.step3Desc],
    [text.step4, text.step4Title, text.step4Desc],
  ];

  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="eyebrow">{text.eyebrow}</span>

            <h1>
              {text.readWrite}
              <br />
              <em>{text.seekho}</em> {text.pace}
            </h1>

            <svg
              className="chalk-underline"
              viewBox="0 0 280 18"
              aria-hidden="true"
            >
              <path
                ref={pathRef}
                d="M4 12 Q40 2, 80 10 T160 8 T240 12 T276 6"
                fill="none"
                stroke="#E8A33D"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            <p className="lede">{text.lede}</p>

            <div className="hero-actions">
              <Link
                className="btn btn-primary"
                to={learner ? "/dashboard" : "/auth"}
              >
                {learner ? text.dashboard : text.startLearning}
              </Link>

              <Link className="btn btn-ghost" to="/levels">
                {text.proficiency}
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <span className="mono">{text.todaysFocus}</span>

            <div className="big">{text.vocabulary}</div>

            <div
              className="prog-track"
              style={{ marginTop: 10 }}
            >
              <div
                className="prog-fill"
                style={{ width: "42%" }}
              ></div>
            </div>

            <div
              className="mono"
              style={{ marginTop: 8 }}
            >
              {text.level}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">
            {text.supportEyebrow}
          </span>

          <h2>{text.supportTitle}</h2>

          <p>{text.supportDesc}</p>
        </div>

        <div className="grid cols-3">
          {blocks.map(([tag, title, desc]) => (
            <div className="card" key={title}>
              <span className="tag">{tag}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="wrap"
        style={{ paddingTop: 0 }}
      >
        <div className="sec-head">
          <span className="sec-eyebrow">
            {text.journeyEyebrow}
          </span>

          <h2>{text.journeyTitle}</h2>
        </div>

        <div className="grid cols-4">
          {steps.map(([tag, title, desc]) => (
            <div className="card" key={title}>
              <span className="tag mono">{tag}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer>{text.footer}</footer>
    </>
  );
}