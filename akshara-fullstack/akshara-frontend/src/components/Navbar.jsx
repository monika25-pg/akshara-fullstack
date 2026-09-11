import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { learner, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const pages = [
    { to: "/", label: "home" },

    // Show Register / Login only when NOT logged in
    ...(!learner
      ? [{ to: "/auth", label: "registerLogin" }]
      : []),

    ...(learner
      ? [{ to: "/profile", label: "profile" }]
      : []),

    { to: "/dashboard", label: "dashboard" },
    { to: "/learn", label: "learn" },

    ...(learner
      ? [{ to: "/assessment", label: "assessment" }]
      : []),

    { to: "/levels", label: "levels" },
  ];

  return (
    <header
      className="site-nav"
      style={{
        width: "100%",
        borderBottom: "1px solid rgba(35, 63, 54, 0.15)",
      }}
    >
      <div
        className="nav-inner"
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          minHeight: "72px",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          boxSizing: "border-box",
          gap: "30px",
        }}
      >
        {/* BRAND */}
        <NavLink
          to="/"
          className="brand"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div className="brand-mark">अ</div>

          <div>
            <div className="brand-name">Akshara</div>

            <div className="brand-sub">
              LITERACY PLATFORM
            </div>
          </div>
        </NavLink>

        {/* NAVIGATION */}
        <nav
          className="nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            flex: "1 1 auto",
            whiteSpace: "nowrap",
          }}
        >
          {pages.map((page) => (
            <NavLink
              key={page.to}
              to={page.to}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              style={{
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              {t(page.label)}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div
          className="nav-right"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "14px",
            flexShrink: 0,
          }}
        >
          <select
            className="nav-language-select"
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value)
            }
            aria-label="Interface language"
            style={{
              width: "175px",
              minWidth: "175px",
              height: "44px",
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
          </select>

          {learner && (
            <>
              <span
                className="nav-status"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {t("signedIn")} —{" "}
                {learner.name || "Learner"}
              </span>

              <button
                type="button"
                className="logout-btn"
                onClick={logout}
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}