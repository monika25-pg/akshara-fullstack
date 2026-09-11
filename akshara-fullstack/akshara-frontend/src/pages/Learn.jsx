import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentAPI } from "../api/resources";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const UI = {
  en: {
    learn: "LEARN",
    sounds: "SOUNDS",
    progress: "PROGRESS",
    profile: "PROFILE",
    section: "SECTION 1",
    unit: "UNIT 1",
    title: "Getting Started",
    subtitle: "Learn the basics step by step",
    start: "START",
    lesson: "Lesson",
    locked: "Complete the previous lesson",
    completed: "Completed",
    xp: "XP",
    streak: "STREAK",
    hearts: "HEARTS",
    chooseLanguage: "Choose a learning language",
    noCourse: "No course available for this language yet.",
    loading: "Loading...",
    guidebook: "GUIDEBOOK",
  },

  hi: {
    learn: "सीखें",
    sounds: "ध्वनियाँ",
    progress: "प्रगति",
    profile: "प्रोफ़ाइल",
    section: "खंड 1",
    unit: "इकाई 1",
    title: "शुरुआत",
    subtitle: "चरण-दर-चरण मूल बातें सीखें",
    start: "शुरू करें",
    lesson: "पाठ",
    locked: "पिछला पाठ पूरा करें",
    completed: "पूरा हुआ",
    xp: "XP",
    streak: "स्ट्रीक",
    hearts: "हृदय",
    chooseLanguage: "सीखने की भाषा चुनें",
    noCourse: "इस भाषा के लिए अभी कोई कोर्स उपलब्ध नहीं है।",
    loading: "लोड हो रहा है...",
    guidebook: "गाइडबुक",
  },

  kn: {
    learn: "ಕಲಿಯಿರಿ",
    sounds: "ಧ್ವನಿಗಳು",
    progress: "ಪ್ರಗತಿ",
    profile: "ಪ್ರೊಫೈಲ್",
    section: "ವಿಭಾಗ 1",
    unit: "ಘಟಕ 1",
    title: "ಪ್ರಾರಂಭ",
    subtitle: "ಹಂತ ಹಂತವಾಗಿ ಮೂಲಭೂತ ವಿಷಯಗಳನ್ನು ಕಲಿಯಿರಿ",
    start: "ಪ್ರಾರಂಭಿಸಿ",
    lesson: "ಪಾಠ",
    locked: "ಹಿಂದಿನ ಪಾಠವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
    completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    xp: "XP",
    streak: "ಸ್ಟ್ರೀಕ್",
    hearts: "ಹೃದಯಗಳು",
    chooseLanguage: "ಕಲಿಕೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    noCourse: "ಈ ಭಾಷೆಗೆ ಇನ್ನೂ ಯಾವುದೇ ಕೋರ್ಸ್ ಲಭ್ಯವಿಲ್ಲ.",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    guidebook: "ಗೈಡ್‌ಬುಕ್",
  },

  te: {
    learn: "నేర్చుకోండి",
    sounds: "ధ్వనులు",
    progress: "పురోగతి",
    profile: "ప్రొఫైల్",
    section: "విభాగం 1",
    unit: "యూనిట్ 1",
    title: "ప్రారంభం",
    subtitle: "దశలవారీగా ప్రాథమిక విషయాలను నేర్చుకోండి",
    start: "ప్రారంభించండి",
    lesson: "పాఠం",
    locked: "మునుపటి పాఠాన్ని పూర్తి చేయండి",
    completed: "పూర్తయింది",
    xp: "XP",
    streak: "స్ట్రీక్",
    hearts: "హృదయాలు",
    chooseLanguage: "అభ్యాస భాషను ఎంచుకోండి",
    noCourse: "ఈ భాషకు ఇంకా కోర్సు అందుబాటులో లేదు.",
    loading: "లోడ్ అవుతోంది...",
    guidebook: "గైడ్‌బుక్",
  },

  ta: {
    learn: "கற்றுக்கொள்ளுங்கள்",
    sounds: "ஒலிகள்",
    progress: "முன்னேற்றம்",
    profile: "சுயவிவரம்",
    section: "பகுதி 1",
    unit: "அலகு 1",
    title: "தொடக்கம்",
    subtitle: "படிப்படியாக அடிப்படைகளைக் கற்றுக்கொள்ளுங்கள்",
    start: "தொடங்கு",
    lesson: "பாடம்",
    locked: "முந்தைய பாடத்தை முடிக்கவும்",
    completed: "முடிந்தது",
    xp: "XP",
    streak: "தொடர்",
    hearts: "இதயங்கள்",
    chooseLanguage: "கற்றல் மொழியைத் தேர்ந்தெடுக்கவும்",
    noCourse: "இந்த மொழிக்கு இன்னும் பாடநெறி இல்லை.",
    loading: "ஏற்றப்படுகிறது...",
    guidebook: "வழிகாட்டி",
  },
};

export default function Learn() {
  const navigate = useNavigate();
  const { learner } = useAuth();
  const { language } = useLanguage();

  const text = UI[language] || UI.en;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  /*
   * For now these are local UI progress values.
   * Later we will connect them to LearningProgress in Django.
   */
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("akshara_completed_lessons") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [xp] = useState(() => {
    return Number(localStorage.getItem("akshara_xp") || 0);
  });

  const [streak] = useState(() => {
    return Number(localStorage.getItem("akshara_streak") || 0);
  });

  const [hearts] = useState(5);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);

    try {
      const response = await ContentAPI.courses();
      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data?.results || [];

      setCourses(list);

      if (list.length > 0) {
        let selected = null;

        if (learner?.learning_language) {
          selected = list.find(
            (course) =>
              course.language === learner.learning_language ||
              course.language_id === learner.learning_language ||
              course.language?.id === learner.learning_language
          );
        }

        setSelectedCourse(selected || list[0]);
      }
    } catch (error) {
      console.error("Could not load courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const lessons = selectedCourse?.lessons || [];

  const isCompleted = (lesson) => {
    return completedLessons.includes(lesson.id);
  };

  const isUnlocked = (index) => {
    if (index === 0) {
      return true;
    }

    const previous = lessons[index - 1];

    return previous
      ? completedLessons.includes(previous.id)
      : false;
  };

  const openLesson = (lesson, index) => {
    if (!isUnlocked(index)) {
      return;
    }

    navigate(`/learn/lesson/${lesson.id}`);
  };

  if (loading) {
    return (
      <main className="duo-page">
        <div className="duo-loading">{text.loading}</div>
      </main>
    );
  }

  return (
    <main className="duo-page">
      {/* TOP BAR */}
      <header className="duo-topbar">
        <div className="duo-logo">
          <span className="duo-logo-mark">अ</span>
          <span>Akshara</span>
        </div>

        <div className="duo-stats">
          <div className="duo-stat">
            <span className="duo-stat-icon">🌐</span>
            <strong>
              {selectedCourse?.language_name ||
                learner?.learning_language_name ||
                "English"}
            </strong>
          </div>

          <div className="duo-stat">
            <span>🔥</span>
            <strong>{streak}</strong>
          </div>

          <div className="duo-stat">
            <span>⭐</span>
            <strong>{xp}</strong>
          </div>

          <div className="duo-stat">
            <span>❤️</span>
            <strong>{hearts}</strong>
          </div>
        </div>
      </header>

      <div className="duo-layout">
        {/* SIDEBAR */}
        <aside className="duo-sidebar">
          <button className="duo-side-item active">
            <span>🏠</span>
            <span>{text.learn}</span>
          </button>

          <button
            className="duo-side-item"
            onClick={() => navigate("/levels")}
          >
            <span>🔊</span>
            <span>{text.sounds}</span>
          </button>

          <button
            className="duo-side-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>🏆</span>
            <span>{text.progress}</span>
          </button>

          <button
            className="duo-side-item"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            <span>{text.profile}</span>
          </button>
        </aside>

        {/* LEARNING PATH */}
        <section className="duo-main">
          <div className="duo-course-select">
            <label>{text.chooseLanguage}</label>

            <select
              value={selectedCourse?.id || ""}
              onChange={(event) => {
                const course = courses.find(
                  (item) =>
                    String(item.id) === event.target.value
                );

                setSelectedCourse(course || null);
              }}
            >
              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.language_name ||
                    course.language?.name ||
                    course.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCourse ? (
            <>
              {/* UNIT HEADER */}
              <div className="duo-unit-card">
                <div>
                  <div className="duo-unit-small">
                    {text.section} • {text.unit}
                  </div>

                  <h1>
                    {selectedCourse.title ||
                      text.title}
                  </h1>

                  <p>
                    {selectedCourse.description ||
                      text.subtitle}
                  </p>
                </div>

                <button
                  className="duo-guide-btn"
                  type="button"
                >
                  📖 {text.guidebook}
                </button>
              </div>

              {/* PATH */}
              <div className="duo-path">
                {lessons.length === 0 ? (
                  <div className="duo-empty">
                    {text.noCourse}
                  </div>
                ) : (
                  lessons.map((lesson, index) => {
                    const completed =
                      isCompleted(lesson);

                    const unlocked =
                      isUnlocked(index);

                    return (
                      <div
                        className={
                          index % 2 === 0
                            ? "duo-node-row left"
                            : "duo-node-row right"
                        }
                        key={lesson.id}
                      >
                        <button
                          type="button"
                          className={
                            completed
                              ? "duo-lesson completed"
                              : unlocked
                              ? "duo-lesson unlocked"
                              : "duo-lesson locked"
                          }
                          onClick={() =>
                            openLesson(
                              lesson,
                              index
                            )
                          }
                          disabled={!unlocked}
                        >
                          <div className="duo-lesson-circle">
                            {completed
                              ? "✓"
                              : unlocked
                              ? "★"
                              : "🔒"}
                          </div>

                          <div className="duo-lesson-label">
                            <strong>
                              {completed
                                ? text.completed
                                : unlocked
                                ? text.start
                                : text.locked}
                            </strong>

                            <span>
                              {text.lesson}{" "}
                              {index + 1}
                            </span>

                            <small>
                              {lesson.title}
                            </small>
                          </div>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="duo-empty">
              {text.noCourse}
            </div>
          )}
        </section>

        {/* RIGHT PANEL */}
        <aside className="duo-right-panel">
          <div className="duo-card">
            <h3>🔥 {text.streak}</h3>
            <div className="duo-big-number">
              {streak}
            </div>
            <p>
              Keep learning every day to build your
              streak.
            </p>
          </div>

          <div className="duo-card">
            <h3>⭐ {text.xp}</h3>
            <div className="duo-big-number">
              {xp}
            </div>
            <p>
              Complete lessons to earn more XP.
            </p>
          </div>

          <div className="duo-card">
            <h3>❤️ {text.hearts}</h3>

            <div className="duo-hearts">
              {"❤️".repeat(hearts)}
            </div>

            <p>
              Hearts will be used during practice.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}