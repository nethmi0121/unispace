import React from "react";

// UniSpace — landing page
// Design note: rather than hotlinking a photo of the University of Colombo
// (unreliable to embed, and not ours to redistribute), the backdrop is an
// original line-art illustration evoking the colonnades, arches and clock
// tower of UoC's colonial-era campus architecture, in a maroon-and-gold
// heritage palette.

const FONT_IMPORT_ID = "unispace-fonts";

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

function CampusMotif({ style }) {
  // Original line-art skyline: colonnade, central dome, clock tower.
  // Drawn from scratch — not a reproduction of any existing photo or artwork.
  return (
    <svg
      viewBox="0 0 800 260"
      preserveAspectRatio="xMidYMax slice"
      style={style}
      aria-hidden="true"
    >
      <g fill="none" stroke="#e8c874" strokeWidth="1.5" opacity="0.5">
        {/* ground line */}
        <line x1="0" y1="255" x2="800" y2="255" />

        {/* left colonnade */}
        {[40, 80, 120, 160, 200].map((x) => (
          <line key={x} x1={x} y1="150" x2={x} y2="255" />
        ))}
        <line x1="20" y1="150" x2="220" y2="150" />
        <path d="M20,150 Q120,110 220,150" />

        {/* right colonnade */}
        {[600, 640, 680, 720, 760].map((x) => (
          <line key={x} x1={x} y1="150" x2={x} y2="255" />
        ))}
        <line x1="580" y1="150" x2="780" y2="150" />
        <path d="M580,150 Q680,110 780,150" />

        {/* central building block */}
        <rect x="280" y="120" width="240" height="135" />
        <line x1="280" y1="120" x2="520" y2="120" />

        {/* central arches */}
        {[310, 360, 410, 460].map((x) => (
          <path key={x} d={`M${x},255 L${x},190 Q${x + 15},170 ${x + 30},190 L${x + 30},255`} />
        ))}

        {/* dome */}
        <circle cx="400" cy="95" r="34" />
        <line x1="366" y1="95" x2="434" y2="95" />
        <line x1="400" y1="61" x2="400" y2="40" />
        <circle cx="400" cy="34" r="4" />

        {/* clock tower, left of dome */}
        <rect x="150" y="60" width="30" height="90" />
        <circle cx="165" cy="80" r="10" />
        <line x1="165" y1="80" x2="165" y2="74" />
        <line x1="165" y1="80" x2="170" y2="83" />
        <path d="M150,60 L165,42 L180,60" />
      </g>
    </svg>
  );
}

function LandingPage({ onStudentClick, onAdminClick, onAnalyticsClick }) {
  React.useEffect(() => {
    ensureFonts();
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

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(180deg, #3a0f18 0%, #5c1b26 45%, #7a2534 100%)",
        fontFamily: "'Work Sans', sans-serif",
        padding: "24px",
      }}
    >
      {/* faint grain / vignette for depth, no external assets */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,220,150,0.10), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <CampusMotif
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "38%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 251, 244, 0.97)",
          padding: "48px 44px",
          borderRadius: "18px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          textAlign: "center",
          width: "100%",
          maxWidth: "420px",
          border: "1px solid rgba(201,162,39,0.35)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              width: "28px",
              height: "1px",
              background: "#c9a227",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.14em",
              color: "#8a2b3b",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            University of Colombo
          </span>
          <span
            style={{
              width: "28px",
              height: "1px",
              background: "#c9a227",
              display: "inline-block",
            }}
          />
        </div>

        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: "32px",
            color: "#3a0f18",
            margin: "6px 0 6px",
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

        <p style={{ marginTop: "28px", fontSize: "11px", color: "#b6a894" }}>
          est. 1921 · Colombo, Sri Lanka
        </p>
      </div>
    </div>
  );
}

export default LandingPage;