import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ProgressAPI, AssessmentAPI } from "../api/resources";
import { levelById } from "../data/levels";

const TEXT = {
  en: {
    eyebrow: "04 · Learning progress",
    signInTitle: "Sign in to see your dashboard",
    noSession: "No active learner session.",
    register: "Register or log in",
    welcome: "Welcome back",
    learner: "learner",
    intro: "Your current level, lesson progress, and where to focus next.",
    currentLevel: "Current level",
    overallProgress: "Overall progress",
    assessmentsTaken: "Assessments taken",
    learningLanguage: "Learning language",
    loading: "Loading your progress…",
    lessonProgress: "Lesson progress",
    noProgress: "No progress recorded yet — head to the",
    learn: "Learn",
    startLesson: "page to start a lesson.",
    continue: "Continue learning →",
    recommended: "Recommended next",
    placement: "Take a placement check",
    placementDesc: "Complete an",
    assessment: "assessment",
    firstRecommendation: "to get your first personalized recommendation.",
    noRecommendation: "No recommendations yet.",
  },

  hi: {
    eyebrow: "04 · सीखने की प्रगति",
    signInTitle: "डैशबोर्ड देखने के लिए साइन इन करें",
    noSession: "कोई सक्रिय शिक्षार्थी सत्र नहीं है।",
    register: "पंजीकरण करें या लॉगिन करें",
    welcome: "वापसी पर स्वागत है",
    learner: "शिक्षार्थी",
    intro: "आपका वर्तमान स्तर, पाठ की प्रगति और आगे किस पर ध्यान देना है।",
    currentLevel: "वर्तमान स्तर",
    overallProgress: "कुल प्रगति",
    assessmentsTaken: "किए गए मूल्यांकन",
    learningLanguage: "सीखने की भाषा",
    loading: "आपकी प्रगति लोड हो रही है…",
    lessonProgress: "पाठ की प्रगति",
    noProgress: "अभी तक कोई प्रगति दर्ज नहीं हुई है —",
    learn: "सीखें",
    startLesson: "पृष्ठ पर जाएँ और पाठ शुरू करें।",
    continue: "सीखना जारी रखें →",
    recommended: "अगला सुझाव",
    placement: "स्तर निर्धारण मूल्यांकन करें",
    placementDesc: "अपनी पहली व्यक्तिगत अनुशंसा पाने के लिए एक",
    assessment: "मूल्यांकन",
    firstRecommendation: "पूरा करें।",
    noRecommendation: "अभी कोई अनुशंसा नहीं है।",
  },

  kn: {
    eyebrow: "04 · ಕಲಿಕೆಯ ಪ್ರಗತಿ",
    signInTitle: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    noSession: "ಯಾವುದೇ ಸಕ್ರಿಯ ಕಲಿಯುವವರ ಸತ್ರವಿಲ್ಲ.",
    register: "ನೋಂದಣಿ ಮಾಡಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ",
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
    learner: "ಕಲಿಯುವವರು",
    intro: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮಟ್ಟ, ಪಾಠದ ಪ್ರಗತಿ ಮತ್ತು ಮುಂದೆ ಯಾವುದರ ಮೇಲೆ ಗಮನ ಹರಿಸಬೇಕು.",
    currentLevel: "ಪ್ರಸ್ತುತ ಮಟ್ಟ",
    overallProgress: "ಒಟ್ಟು ಪ್ರಗತಿ",
    assessmentsTaken: "ಮಾಡಿದ ಮೌಲ್ಯಮಾಪನಗಳು",
    learningLanguage: "ಕಲಿಕೆಯ ಭಾಷೆ",
    loading: "ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…",
    lessonProgress: "ಪಾಠದ ಪ್ರಗತಿ",
    noProgress: "ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಗತಿ ದಾಖಲಾಗಿಲ್ಲ —",
    learn: "ಕಲಿಯಿರಿ",
    startLesson: "ಪುಟಕ್ಕೆ ಹೋಗಿ ಪಾಠವನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
    continue: "ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ →",
    recommended: "ಮುಂದಿನ ಶಿಫಾರಸು",
    placement: "ಮಟ್ಟ ನಿರ್ಧಾರ ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ",
    placementDesc: "ನಿಮ್ಮ ಮೊದಲ ವೈಯಕ್ತಿಕ ಶಿಫಾರಸನ್ನು ಪಡೆಯಲು ಒಂದು",
    assessment: "ಮೌಲ್ಯಮಾಪನ",
    firstRecommendation: "ಪೂರ್ಣಗೊಳಿಸಿ.",
    noRecommendation: "ಇನ್ನೂ ಯಾವುದೇ ಶಿಫಾರಸುಗಳಿಲ್ಲ.",
  },

  te: {
    eyebrow: "04 · అభ్యాస పురోగతి",
    signInTitle: "డ్యాష్‌బోర్డ్ చూడటానికి సైన్ ఇన్ చేయండి",
    noSession: "క్రియాశీల అభ్యాసకుల సెషన్ లేదు.",
    register: "నమోదు చేసుకోండి లేదా లాగిన్ చేయండి",
    welcome: "తిరిగి స్వాగతం",
    learner: "అభ్యాసకుడు",
    intro: "మీ ప్రస్తుత స్థాయి, పాఠం పురోగతి మరియు తరువాత దేనిపై దృష్టి పెట్టాలో చూడండి.",
    currentLevel: "ప్రస్తుత స్థాయి",
    overallProgress: "మొత్తం పురోగతి",
    assessmentsTaken: "చేసిన మూల్యాంకనాలు",
    learningLanguage: "అభ్యాస భాష",
    loading: "మీ పురోగతి లోడ్ అవుతోంది…",
    lessonProgress: "పాఠం పురోగతి",
    noProgress: "ఇంకా పురోగతి నమోదు కాలేదు —",
    learn: "నేర్చుకోండి",
    startLesson: "పేజీకి వెళ్లి పాఠాన్ని ప్రారంభించండి.",
    continue: "అభ్యాసాన్ని కొనసాగించండి →",
    recommended: "తదుపరి సిఫార్సు",
    placement: "స్థాయి నిర్ధారణ మూల్యాంకనం చేయండి",
    placementDesc: "మీ మొదటి వ్యక్తిగత సిఫార్సును పొందడానికి ఒక",
    assessment: "మూల్యాంకనం",
    firstRecommendation: "పూర్తి చేయండి.",
    noRecommendation: "ఇంకా సిఫార్సులు లేవు.",
  },

  ta: {
    eyebrow: "04 · கற்றல் முன்னேற்றம்",
    signInTitle: "டாஷ்போர்டைப் பார்க்க உள்நுழையவும்",
    noSession: "செயலில் உள்ள கற்றல் அமர்வு இல்லை.",
    register: "பதிவு செய்யவும் அல்லது உள்நுழையவும்",
    welcome: "மீண்டும் வரவேற்கிறோம்",
    learner: "கற்றவர்",
    intro: "உங்கள் தற்போதைய நிலை, பாட முன்னேற்றம் மற்றும் அடுத்ததாக எதில் கவனம் செலுத்த வேண்டும்.",
    currentLevel: "தற்போதைய நிலை",
    overallProgress: "மொத்த முன்னேற்றம்",
    assessmentsTaken: "முடிக்கப்பட்ட மதிப்பீடுகள்",
    learningLanguage: "கற்றல் மொழி",
    loading: "உங்கள் முன்னேற்றம் ஏற்றப்படுகிறது…",
    lessonProgress: "பாட முன்னேற்றம்",
    noProgress: "இன்னும் முன்னேற்றம் பதிவு செய்யப்படவில்லை —",
    learn: "கற்றுக்கொள்ளுங்கள்",
    startLesson: "பக்கத்திற்குச் சென்று பாடத்தைத் தொடங்கவும்.",
    continue: "கற்றலைத் தொடரவும் →",
    recommended: "அடுத்த பரிந்துரை",
    placement: "நிலை மதிப்பீட்டைச் செய்யவும்",
    placementDesc: "உங்கள் முதல் தனிப்பட்ட பரிந்துரையைப் பெற ஒரு",
    assessment: "மதிப்பீட்டை",
    firstRecommendation: "முடிக்கவும்.",
    noRecommendation: "இன்னும் பரிந்துரைகள் இல்லை.",
  },
};

export default function Dashboard() {
  const { learner } = useAuth();
  const { language } = useLanguage();

  const text = TEXT[language] || TEXT.en;

  const [progress, setProgress] = useState([]);
  const [recs, setRecs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!learner) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      ProgressAPI.mine(),
      ProgressAPI.myRecommendations(),
      AssessmentAPI.myResults(),
    ])
      .then(([p, r, res]) => {
        setProgress(p.data.results || p.data || []);
        setRecs(r.data.results || r.data || []);
        setResults(res.data.results || res.data || []);
      })
      .catch((error) => {
        console.error("Failed to load dashboard:", error);
      })
      .finally(() => setLoading(false));
  }, [learner]);

  if (!learner) {
    return (
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-eyebrow">
            {text.eyebrow}
          </span>

          <h2>{text.signInTitle}</h2>
        </div>

        <p>
          {text.noSession}{" "}
          <Link to="/auth">{text.register}</Link>.
        </p>
      </div>
    );
  }

  const level = levelById(learner.proficiency_level);

  const avg = progress.length
    ? Math.round(
        progress.reduce(
          (sum, item) =>
            sum + Number(item.percent_complete || 0),
          0
        ) / progress.length
      )
    : 0;

  const firstName =
    learner.name?.split(" ")[0] || text.learner;

  const learningLanguage =
    learner.learning_language_name ||
    learner.preferred_language_name ||
    "—";

  return (
    <div className="wrap">
      <div className="sec-head">
        <span className="sec-eyebrow">
          {text.eyebrow}
        </span>

        <h2>
          {text.welcome}, {firstName}
        </h2>

        <p>{text.intro}</p>
      </div>

      <div className="dash-top">
        <div className="stat-card">
          <div className="num">{level.short}</div>
          <div className="lab">
            {text.currentLevel}
          </div>
        </div>

        <div className="stat-card">
          <div className="num">{avg}%</div>
          <div className="lab">
            {text.overallProgress}
          </div>
        </div>

        <div className="stat-card">
          <div className="num">{results.length}</div>
          <div className="lab">
            {text.assessmentsTaken}
          </div>
        </div>

        <div className="stat-card">
          <div
            className="num"
            style={{
              fontSize: learningLanguage === "—"
                ? undefined
                : 22,
            }}
          >
            {learningLanguage}
          </div>

          <div className="lab">
            {text.learningLanguage}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          {text.loading}
        </div>
      ) : (
        <div className="grid cols-2">
          <div>
            <h3 style={{ marginBottom: 14 }}>
              {text.lessonProgress}
            </h3>

            {progress.length === 0 ? (
              <div className="card">
                <p>
                  {text.noProgress}{" "}
                  <Link to="/learn">
                    {text.learn}
                  </Link>{" "}
                  {text.startLesson}
                </p>
              </div>
            ) : (
              progress.map((item) => (
                <div
                  className="card"
                  key={item.id}
                  style={{ marginBottom: 12 }}
                >
                  <span className="tag">
                    {item.content_type}
                  </span>

                  <h3>{item.lesson_title}</h3>

                  <div
                    className="prog-track"
                    style={{ marginTop: 10 }}
                  >
                    <div
                      className="prog-fill"
                      style={{
                        width: `${item.percent_complete}%`,
                      }}
                    />
                  </div>

                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      marginTop: 6,
                    }}
                  >
                    {item.status} ·{" "}
                    {item.percent_complete}%
                  </div>
                </div>
              ))
            )}

            <Link
              className="btn btn-primary"
              to="/learn"
              style={{ marginTop: 8 }}
            >
              {text.continue}
            </Link>
          </div>

          <div>
            <h3 style={{ marginBottom: 14 }}>
              {text.recommended}
            </h3>

            {recs.length === 0 ? (
              <div className="rec-card">
                <div className="rec-icon">✓</div>

                <div>
                  <strong>
                    {text.placement}
                  </strong>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "var(--ink-soft)",
                      fontSize: 13,
                    }}
                  >
                    {text.placementDesc}{" "}
                    <Link to="/assessment">
                      {text.assessment}
                    </Link>{" "}
                    {text.firstRecommendation}
                  </p>
                </div>
              </div>
            ) : (
              recs.map((item) => (
                <div
                  className="rec-card"
                  key={item.id}
                >
                  <div className="rec-icon">
                    ★
                  </div>

                  <div>
                    <strong>
                      {item.lesson_title}
                    </strong>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "var(--ink-soft)",
                        fontSize: 13,
                      }}
                    >
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}