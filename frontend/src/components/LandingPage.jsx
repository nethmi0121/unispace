import React from "react";

const FONT_IMPORT_ID = "unispace-fonts";
const STYLE_ID = "unispace-split-styles";

function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_IMPORT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_IMPORT_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Work+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

function ensureResponsiveStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    .unispace-split { flex-direction: row; }
    .unispace-scene-pane { width: 46%; min-height: 100vh; }
    .unispace-form-pane { width: 54%; }
    @media (max-width: 860px) {
      .unispace-split { flex-direction: column; }
      .unispace-scene-pane { width: 100%; min-height: 320px; }
      .unispace-form-pane { width: 100%; }
    }
  `;
  document.head.appendChild(style);
}

function LandingPage({ onStudentClick, onAdminClick, onAnalyticsClick }) {
  React.useEffect(() => {
    ensureFonts();
    ensureResponsiveStyles();
  }, []);

  const buttons = [
    {
      label: "Student portal",
      sub: "Timetables, results, campus life",
      icon: "🎓",
      onClick: onStudentClick,
      accent: "#c9a227",
    },
    {
      label: "Admin login",
      sub: "Staff and faculty access",
      icon: "🔑",
      onClick: onAdminClick,
      accent: "#8a2b3b",
    },
    {
      label: "Campus analytics",
      sub: "Enrolment and usage insights",
      icon: "📊",
      onClick: onAnalyticsClick,
      accent: "#3d5a6c",
    },
  ];

  // Campus background photo
  const campusPhoto =
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80";

  return (
    <div
      className="unispace-split"
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "'Work Sans', sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Photo pane with maroon gradient overlay */}
      <div
        className="unispace-scene-pane"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: `
            linear-gradient(180deg, rgba(44, 11, 20, 0.7) 0%, rgba(110, 36, 49, 0.8) 60%, rgba(58, 15, 24, 0.95) 100%),
            url("${campusPhoto}")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "1px",
                background: "#e8c874",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "#f0d99a",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              University of Colombo
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "24px",
              color: "#fff6e6",
              margin: "0 0 8px",
              maxWidth: "380px",
            }}
          >
            One campus, every workflow, in a single space.
          </h2>
          <p style={{ fontSize: "12px", color: "#d8b9a8", margin: 0 }}>
            est. 1921 · Colombo, Sri Lanka
          </p>
        </div>
      </div>

      {/* Form pane */}
      <div
        className="unispace-form-pane"
        style={{
          background: "#fffbf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            textAlign: "center",
          }}
        >
          {/* Optional university seal / logo pic */}
          <div style={{ marginBottom: "16px" }}>
            <img
              src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=160&q=80"
              alt="University Crest"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #c9a227",
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "32px",
              color: "#3a0f18",
              margin: "0 0 6px",
            }}
          >
            UniSpace
          </h1>

          <p style={{ color: "#7a6a5a", marginBottom: "30px", fontSize: "14.5px" }}>
            Select your portal to continue
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {buttons.map((b) => (
              <button
                key={b.label}
                onClick={b.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  width: "100%",
                  padding: "14px 18px",
                  background: "#fff",
                  border: "1px solid #e8ddc8",
                  borderLeft: `4px solid ${b.accent}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{b.icon}</span>
                <span style={{ flex: 1 }}>
                  <span
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "#2b2117",
                    }}
                  >
                    {b.label}
                  </span>
                  <span style={{ display: "block", fontSize: "12.5px", color: "#9a8b78" }}>
                    {b.sub}
                  </span>
                </span>
                <span style={{ color: "#c9a227", fontSize: "16px" }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;