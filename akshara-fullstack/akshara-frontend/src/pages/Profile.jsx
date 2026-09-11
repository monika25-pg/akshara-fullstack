import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ContentAPI, LearnerAPI } from "../api/resources";
import { Link } from "react-router-dom";
import { levelById } from "../data/levels";
import { useLanguage } from "../context/LanguageContext";

const PROFILE_TEXT = {
  en: {
    eyebrow: "Learner profile",
    title: "Your profile",
    notSignedIn:
      "You're not signed in yet.",
    registerLogin: "Register or log in",
    viewProfile: "to view your profile.",
    description:
      "Basic information, learning language and proficiency level — the fields that drive personalization across the platform.",
    fullName: "Full name",
    age: "Age",
    email: "Email / phone",
    learningLanguage: "Learning language",
    saving: "saving…",
    proficiency: "Proficiency level",
    note:
      "This level was set at registration and updates automatically each time you complete an",
    assessment: "assessment",
    learner: "Learner",
  },

  hi: {
    eyebrow: "शिक्षार्थी प्रोफ़ाइल",
    title: "आपकी प्रोफ़ाइल",
    notSignedIn:
      "आपने अभी साइन इन नहीं किया है।",
    registerLogin: "पंजीकरण करें या लॉगिन करें",
    viewProfile: "अपनी प्रोफ़ाइल देखने के लिए।",
    description:
      "मूल जानकारी, सीखने की भाषा और दक्षता स्तर — ये जानकारी पूरे मंच पर आपकी सीखने की प्रक्रिया को आपके अनुसार बनाने में मदद करती है।",
    fullName: "पूरा नाम",
    age: "आयु",
    email: "ईमेल / फ़ोन",
    learningLanguage: "सीखने की भाषा",
    saving: "सहेजा जा रहा है…",
    proficiency: "दक्षता स्तर",
    note:
      "यह स्तर पंजीकरण के समय निर्धारित किया गया था और हर बार मूल्यांकन पूरा करने पर अपने आप अपडेट होता है।",
    assessment: "मूल्यांकन",
    learner: "शिक्षार्थी",
  },

  kn: {
    eyebrow: "ಕಲಿಯುವವರ ಪ್ರೊಫೈಲ್",
    title: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
    notSignedIn:
      "ನೀವು ಇನ್ನೂ ಸೈನ್ ಇನ್ ಆಗಿಲ್ಲ.",
    registerLogin: "ನೋಂದಣಿ ಮಾಡಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ",
    viewProfile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನೋಡಲು.",
    description:
      "ಮೂಲ ಮಾಹಿತಿ, ಕಲಿಕೆಯ ಭಾಷೆ ಮತ್ತು ಪ್ರಾವೀಣ್ಯತೆಯ ಮಟ್ಟ — ಈ ಮಾಹಿತಿಯು ವೇದಿಕೆಯಲ್ಲಿ ನಿಮ್ಮ ಕಲಿಕೆಯನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    age: "ವಯಸ್ಸು",
    email: "ಇಮೇಲ್ / ಫೋನ್",
    learningLanguage: "ಕಲಿಕೆಯ ಭಾಷೆ",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ…",
    proficiency: "ಪ್ರಾವೀಣ್ಯತೆಯ ಮಟ್ಟ",
    note:
      "ಈ ಮಟ್ಟವನ್ನು ನೋಂದಣಿ ಸಮಯದಲ್ಲಿ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ ಮತ್ತು ನೀವು ಪ್ರತಿ ಬಾರಿ ಮೌಲ್ಯಮಾಪನವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದಾಗ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಿಸಲಾಗುತ್ತದೆ.",
    assessment: "ಮೌಲ್ಯಮಾಪನ",
    learner: "ಕಲಿಯುವವರು",
  },

  te: {
    eyebrow: "అభ్యాసకుడి ప్రొఫైల్",
    title: "మీ ప్రొఫైల్",
    notSignedIn:
      "మీరు ఇంకా సైన్ ఇన్ చేయలేదు.",
    registerLogin: "నమోదు చేసుకోండి లేదా లాగిన్ చేయండి",
    viewProfile: "మీ ప్రొఫైల్‌ను చూడటానికి.",
    description:
      "ప్రాథమిక సమాచారం, నేర్చుకునే భాష మరియు నైపుణ్య స్థాయి — ఈ సమాచారం మొత్తం వేదికలో మీ అభ్యాసాన్ని వ్యక్తిగతీకరించడానికి సహాయపడుతుంది.",
    fullName: "పూర్తి పేరు",
    age: "వయస్సు",
    email: "ఇమెయిల్ / ఫోన్",
    learningLanguage: "నేర్చుకునే భాష",
    saving: "సేవ్ చేస్తోంది…",
    proficiency: "నైపుణ్య స్థాయి",
    note:
      "ఈ స్థాయి నమోదు సమయంలో నిర్ణయించబడింది మరియు మీరు ప్రతి మూల్యాంకనాన్ని పూర్తి చేసినప్పుడు స్వయంచాలకంగా నవీకరించబడుతుంది.",
    assessment: "మూల్యాంకనం",
    learner: "అభ్యాసకుడు",
  },

  ta: {
    eyebrow: "கற்றலாளர் சுயவிவரம்",
    title: "உங்கள் சுயவிவரம்",
    notSignedIn:
      "நீங்கள் இன்னும் உள்நுழையவில்லை.",
    registerLogin: "பதிவு செய்யவும் அல்லது உள்நுழையவும்",
    viewProfile: "உங்கள் சுயவிவரத்தைப் பார்க்க.",
    description:
      "அடிப்படை தகவல், கற்றல் மொழி மற்றும் திறன் நிலை — இந்த தகவல்கள் தளத்தில் உங்கள் கற்றலை தனிப்பயனாக்க உதவுகின்றன.",
    fullName: "முழுப் பெயர்",
    age: "வயது",
    email: "மின்னஞ்சல் / தொலைபேசி",
    learningLanguage: "கற்றல் மொழி",
    saving: "சேமிக்கப்படுகிறது…",
    proficiency: "திறன் நிலை",
    note:
      "இந்த நிலை பதிவு செய்யும் போது அமைக்கப்பட்டது. ஒவ்வொரு மதிப்பீட்டையும் நீங்கள் முடித்ததும் இது தானாக புதுப்பிக்கப்படும்.",
    assessment: "மதிப்பீடு",
    learner: "கற்றலாளர்",
  },
};

export default function Profile() {
  const { learner, refreshLearner } = useAuth();
  const { language } = useLanguage();

  const [languages, setLanguages] = useState([]);
  const [saving, setSaving] = useState(false);

  const text = PROFILE_TEXT[language] || PROFILE_TEXT.en;

  useEffect(() => {
    ContentAPI.languages()
      .then((res) => {
        setLanguages(res.data.results || res.data || []);
      })
      .catch(() => {
        setLanguages([]);
      });
  }, []);

  if (!learner) {
    return (
      <div className="wrap narrow">
        <div className="sec-head">
          <span className="sec-eyebrow">
            {text.eyebrow}
          </span>

          <h2>{text.title}</h2>
        </div>

        <p>
          {text.notSignedIn}{" "}
          <Link to="/auth">{text.registerLogin}</Link>{" "}
          {text.viewProfile}
        </p>
      </div>
    );
  }

  const level = levelById(learner.proficiency_level);

  const changeLanguage = async (id) => {
    if (saving) return;

    setSaving(true);

    try {
      await LearnerAPI.update({
        learning_language: id,
      });

      await refreshLearner();
    } catch (error) {
      console.error(
        "Failed to update learning language:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wrap narrow">
      <div className="sec-head">
        <span className="sec-eyebrow">
          {text.eyebrow}
        </span>

        <h2>{text.title}</h2>

        <p>{text.description}</p>
      </div>

      <div className="form-panel">
        <div className="field-row">
          <div>
            <label>{text.fullName}</label>

            <div
              className="mono"
              style={{ padding: "11px 0" }}
            >
              {learner.name || text.learner}
            </div>
          </div>

          <div>
            <label>{text.age}</label>

            <div
              className="mono"
              style={{ padding: "11px 0" }}
            >
              {learner.age || "—"}
            </div>
          </div>
        </div>

        <label>{text.email}</label>

        <div
          className="mono"
          style={{ padding: "11px 0" }}
        >
          {learner.email}
        </div>

        <label>
          {text.learningLanguage}{" "}
          {saving && `(${text.saving})`}
        </label>

        <div className="pill-select">
          {languages.map((l) => (
            <div
              key={l.id}
              className={
                "pill" +
                (
                  learner.learning_language === l.id
                    ? " selected"
                    : ""
                )
              }
              onClick={() => changeLanguage(l.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  changeLanguage(l.id);
                }
              }}
            >
              {l.name}
            </div>
          ))}
        </div>

        <label>{text.proficiency}</label>

        <div
          className={`level-badge lv${level.id}`}
          style={{ marginTop: 4 }}
        >
          {level.name}
        </div>

        <div className="form-note">
          {text.note}{" "}
          {language === "en" && (
            <Link to="/assessment">
              {text.assessment}
            </Link>
          )}

          {language !== "en" && (
            <Link to="/assessment">
              {text.assessment}
            </Link>
          )}
          .
        </div>
      </div>
    </div>
  );
}