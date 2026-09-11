import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ContentAPI } from "../api/resources";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const UI_TEXT = {
  en: {
    register: "Register",
    login: "Login",
    createTitle: "Create your profile",
    welcomeTitle: "Welcome back",
    subtitle: "Start your language learning journey.",
    loginSubtitle: "Log in to continue learning.",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    age: "Age",
    interfaceLanguage: "Interface language",
    learningLanguage: "Learning language",
    chooseLanguage: "Choose language",
    createAccount: "Create account",
    loginButton: "Login",
    alreadyAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    languagesLoading: "Loading languages...",
    required: "Please fill in all required information.",
    ageError: "Age must be between 5 and 100.",
    passwordError: "Password must be at least 4 characters.",
    languageError: "Please choose a learning language.",
    error: "Something went wrong. Please try again.",
    creating: "Creating...",
    loggingIn: "Logging in...",
  },

  hi: {
    register: "पंजीकरण",
    login: "लॉगिन",
    createTitle: "अपनी प्रोफ़ाइल बनाएँ",
    welcomeTitle: "वापसी पर स्वागत है",
    subtitle: "अपनी भाषा सीखने की यात्रा शुरू करें।",
    loginSubtitle: "सीखना जारी रखने के लिए लॉगिन करें।",
    fullName: "पूरा नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    age: "उम्र",
    interfaceLanguage: "इंटरफ़ेस भाषा",
    learningLanguage: "सीखने की भाषा",
    chooseLanguage: "भाषा चुनें",
    createAccount: "खाता बनाएँ",
    loginButton: "लॉगिन",
    alreadyAccount: "क्या आपके पास पहले से खाता है?",
    noAccount: "क्या आपका खाता नहीं है?",
    languagesLoading: "भाषाएँ लोड हो रही हैं...",
    required: "कृपया सभी आवश्यक जानकारी भरें।",
    ageError: "उम्र 5 से 100 के बीच होनी चाहिए।",
    passwordError: "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।",
    languageError: "कृपया सीखने की भाषा चुनें।",
    error: "कुछ गलत हुआ। कृपया फिर से प्रयास करें।",
    creating: "बनाया जा रहा है...",
    loggingIn: "लॉगिन हो रहा है...",
  },

  kn: {
    register: "ನೋಂದಣಿ",
    login: "ಲಾಗಿನ್",
    createTitle: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ",
    welcomeTitle: "ಮತ್ತೆ ಸ್ವಾಗತ",
    subtitle: "ನಿಮ್ಮ ಭಾಷಾ ಕಲಿಕೆಯ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
    loginSubtitle: "ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    age: "ವಯಸ್ಸು",
    interfaceLanguage: "ಇಂಟರ್‌ಫೇಸ್ ಭಾಷೆ",
    learningLanguage: "ಕಲಿಕೆಯ ಭಾಷೆ",
    chooseLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    createAccount: "ಖಾತೆ ರಚಿಸಿ",
    loginButton: "ಲಾಗಿನ್",
    alreadyAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    languagesLoading: "ಭಾಷೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
    required: "ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ.",
    ageError: "ವಯಸ್ಸು 5 ರಿಂದ 100 ರವರೆಗೆ ಇರಬೇಕು.",
    passwordError: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳಿರಬೇಕು.",
    languageError: "ದಯವಿಟ್ಟು ಕಲಿಕೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    error: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    creating: "ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    loggingIn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
  },

  te: {
    register: "నమోదు",
    login: "లాగిన్",
    createTitle: "మీ ప్రొఫైల్‌ను సృష్టించండి",
    welcomeTitle: "తిరిగి స్వాగతం",
    subtitle: "మీ భాషా అభ్యాస ప్రయాణాన్ని ప్రారంభించండి.",
    loginSubtitle: "అభ్యాసాన్ని కొనసాగించడానికి లాగిన్ చేయండి.",
    fullName: "పూర్తి పేరు",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    age: "వయస్సు",
    interfaceLanguage: "ఇంటర్‌ఫేస్ భాష",
    learningLanguage: "అభ్యాస భాష",
    chooseLanguage: "భాషను ఎంచుకోండి",
    createAccount: "ఖాతాను సృష్టించండి",
    loginButton: "లాగిన్",
    alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
    noAccount: "ఖాతా లేదా?",
    languagesLoading: "భాషలు లోడ్ అవుతున్నాయి...",
    required: "దయచేసి అవసరమైన అన్ని వివరాలను నమోదు చేయండి.",
    ageError: "వయస్సు 5 నుండి 100 మధ్య ఉండాలి.",
    passwordError: "పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.",
    languageError: "దయచేసి అభ్యాస భాషను ఎంచుకోండి.",
    error: "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    creating: "సృష్టిస్తోంది...",
    loggingIn: "లాగిన్ అవుతోంది...",
  },

  ta: {
    register: "பதிவு",
    login: "உள்நுழைவு",
    createTitle: "உங்கள் சுயவிவரத்தை உருவாக்குங்கள்",
    welcomeTitle: "மீண்டும் வரவேற்கிறோம்",
    subtitle: "உங்கள் மொழிக் கற்றல் பயணத்தைத் தொடங்குங்கள்.",
    loginSubtitle: "கற்றலைத் தொடர உள்நுழையுங்கள்.",
    fullName: "முழுப் பெயர்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    age: "வயது",
    interfaceLanguage: "இடைமுக மொழி",
    learningLanguage: "கற்றல் மொழி",
    chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    createAccount: "கணக்கை உருவாக்கவும்",
    loginButton: "உள்நுழைக",
    alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    noAccount: "கணக்கு இல்லையா?",
    languagesLoading: "மொழிகள் ஏற்றப்படுகின்றன...",
    required: "தேவையான அனைத்து தகவல்களையும் நிரப்பவும்.",
    ageError: "வயது 5 முதல் 100 வரை இருக்க வேண்டும்.",
    passwordError: "கடவுச்சொல் குறைந்தது 4 எழுத்துகள் இருக்க வேண்டும்.",
    languageError: "கற்றல் மொழியைத் தேர்ந்தெடுக்கவும்.",
    error: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    creating: "உருவாக்கப்படுகிறது...",
    loggingIn: "உள்நுழைகிறது...",
  },
};

export default function Auth() {
  const navigate = useNavigate();

  const { learner, register, login } = useAuth();
  const { language, setLanguage } = useLanguage();

  const text = UI_TEXT[language] || UI_TEXT.en;

  const [mode, setMode] = useState("register");

  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    age: "",
    learning_language: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* Load learning languages from Django API */
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await ContentAPI.languages();

        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data?.results || [];

        setLanguages(list);

        if (list.length > 0) {
          setForm((previous) => ({
            ...previous,
            learning_language:
              previous.learning_language || list[0].id,
          }));
        }
      } catch (err) {
        console.error(
          "Could not load languages:",
          err
        );

        setError(text.error);
      } finally {
        setLoadingLanguages(false);
      }
    };

    loadLanguages();
  }, []);

  /* If already logged in, go to assessment */
  useEffect(() => {
    if (learner) {
      navigate("/assessment", {
        replace: true,
      });
    }
  }, [learner, navigate]);

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const updateLoginForm = (field, value) => {
    setLoginForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const submitRegister = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.age ||
      !form.learning_language
    ) {
      setError(text.required);
      return;
    }

    const ageNumber = Number(form.age);

    if (
      !Number.isInteger(ageNumber) ||
      ageNumber < 5 ||
      ageNumber > 100
    ) {
      setError(text.ageError);
      return;
    }

    if (form.password.length < 4) {
      setError(text.passwordError);
      return;
    }

    if (!form.learning_language) {
      setError(text.languageError);
      return;
    }

    setSubmitting(true);

    try {
      await register({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        age: ageNumber,
        learning_language:
          form.learning_language,
        proficiency_level: "Beginner",
      });

      navigate("/assessment", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.full_name?.[0] ||
        err?.response?.data?.age?.[0] ||
        err?.response?.data?.learning_language?.[0];

      setError(apiError || text.error);
    } finally {
      setSubmitting(false);
    }
  };

  const submitLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !loginForm.email.trim() ||
      !loginForm.password
    ) {
      setError(text.required);
      return;
    }

    setSubmitting(true);

    try {
      await login(
        loginForm.email.trim(),
        loginForm.password
      );

      navigate("/assessment", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0];

      setError(apiError || text.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-mark">
            अ
          </div>

          <div>
            <div className="auth-logo-name">
              Akshara
            </div>

            <div className="auth-logo-sub">
              LITERACY PLATFORM
            </div>
          </div>
        </div>

        {/* REGISTER */}
        {mode === "register" && (
          <>
            <div className="auth-eyebrow">
              {text.register}
            </div>

            <h1>{text.createTitle}</h1>

            <p className="auth-subtitle">
              {text.subtitle}
            </p>

            <form
              className="auth-form"
              onSubmit={submitRegister}
            >

              {/* Full name + age */}
              <div className="auth-form-row">

                <label>
                  <span>{text.fullName}</span>

                  <input
                    type="text"
                    placeholder="e.g. Lakshmi Devi"
                    value={form.full_name}
                    onChange={(event) =>
                      updateForm(
                        "full_name",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  <span>{text.age}</span>

                  <input
                    type="number"
                    min="5"
                    max="100"
                    placeholder="e.g. 34"
                    value={form.age}
                    onChange={(event) =>
                      updateForm(
                        "age",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

              </div>

              {/* Email + password */}
              <div className="auth-form-row">

                <label>
                  <span>{text.email}</span>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) =>
                      updateForm(
                        "email",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  <span>{text.password}</span>

                  <input
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(event) =>
                      updateForm(
                        "password",
                        event.target.value
                      )
                    }
                    required
                  />
                </label>

              </div>

              {/* Interface language */}
              <label>
                <span>
                  {text.interfaceLanguage}
                </span>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value
                    )
                  }
                >
                  <option value="en">
                    English
                  </option>

                  <option value="hi">
                    हिन्दी
                  </option>

                  <option value="kn">
                    ಕನ್ನಡ
                  </option>

                  <option value="te">
                    తెలుగు
                  </option>

                  <option value="ta">
                    தமிழ்
                  </option>
                </select>
              </label>

              {/* Learning language */}
              <label>
                <span>
                  {text.learningLanguage}
                </span>

                <select
                  value={
                    form.learning_language
                  }
                  onChange={(event) =>
                    updateForm(
                      "learning_language",
                      event.target.value
                    )
                  }
                  disabled={
                    loadingLanguages
                  }
                  required
                >
                  {loadingLanguages ? (
                    <option value="">
                      {text.languagesLoading}
                    </option>
                  ) : (
                    <>
                      <option value="">
                        {text.chooseLanguage}
                      </option>

                      {languages.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        )
                      )}
                    </>
                  )}
                </select>
              </label>

              {/* Error */}
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {/* Create account */}
              <button
                type="submit"
                className="auth-submit"
                disabled={submitting}
              >
                {submitting
                  ? text.creating
                  : text.createAccount}
              </button>

            </form>

            {/* Switch to login */}
            <div className="auth-switch">
              <span>
                {text.alreadyAccount}
              </span>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                {text.login}
              </button>
            </div>
          </>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <div className="auth-eyebrow">
              {text.login}
            </div>

            <h1>{text.welcomeTitle}</h1>

            <p className="auth-subtitle">
              {text.loginSubtitle}
            </p>

            <form
              className="auth-form"
              onSubmit={submitLogin}
            >

              {/* Email */}
              <label>
                <span>{text.email}</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={(event) =>
                    updateLoginForm(
                      "email",
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              {/* Password */}
              <label>
                <span>{text.password}</span>

                <input
                  type="password"
                  placeholder="Your password"
                  value={loginForm.password}
                  onChange={(event) =>
                    updateLoginForm(
                      "password",
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              {/* Interface language */}
              <label>
                <span>
                  {text.interfaceLanguage}
                </span>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value
                    )
                  }
                >
                  <option value="en">
                    English
                  </option>

                  <option value="hi">
                    हिन्दी
                  </option>

                  <option value="kn">
                    ಕನ್ನಡ
                  </option>

                  <option value="te">
                    తెలుగు
                  </option>

                  <option value="ta">
                    தமிழ்
                  </option>
                </select>
              </label>

              {/* Error */}
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                className="auth-submit"
                disabled={submitting}
              >
                {submitting
                  ? text.loggingIn
                  : text.loginButton}
              </button>

            </form>

            {/* Switch to register */}
            <div className="auth-switch">
              <span>
                {text.noAccount}
              </span>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                {text.register}
              </button>
            </div>
          </>
        )}

      </section>
    </main>
  );
}