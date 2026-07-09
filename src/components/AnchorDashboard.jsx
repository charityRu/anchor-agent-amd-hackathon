import React, { useState, useRef, useEffect } from "react";
import { AgentEngine } from "../logic/AgentEngine.js";

export default function AnchorDashboard() {
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState({
    status: "idle",
    severity: null,
    timer: null,
  });

  const [backendMessage, setBackendMessage] = useState("");
  const [input, setInput] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

// ===============================
// 📍 GPS STATE
// ===============================
const [location, setLocation] = useState({
  latitude: null,
  longitude: null,
  accuracy: null,
  error: null,
});
  // ===============================
  // 🎤 VOICE RECOGNITION STATE
  // ===============================
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const [uptime] = useState("99.98%");
  const [activityBars] = useState(() =>
    Array.from({ length: 14 }, () => Math.floor(Math.random() * 60) + 20)
  );

  const agentRef = useRef(null);
  const logScrollRef = useRef(null);
  const anchorHoldTimer = useRef(null);
  // ===============================
  // 🧠 LOGGING SYSTEM
  // ===============================
  const addLog = (msg) => {
    const timestamp =
      new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";

    setLogs((prev) => [{ text: msg, time: timestamp }, ...prev]);
  };

  // ===============================
  // 🤖 AGENT ENGINE INIT (SAFE SINGLETON)
  // ===============================
  if (!agentRef.current) {
    agentRef.current = new AgentEngine(setState, (msg) => addLog(msg));
  }

  const agent = agentRef.current;

  // ===============================
  // 🎤 VOICE CONTROL (UI ONLY)
  // ===============================
  const toggleVoice = () => {
    if (!recognitionRef.current) {
      addLog("⚠️ Voice engine not ready");
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (err) {
      addLog("❌ Voice toggle error: " + err.message);
    }
  };

  // ===============================
  // 🌐 MAIN INITIALIZATION EFFECT
  // ===============================
// ===============================
// 📍 GET USER GPS
// ===============================
useEffect(() => {
  if (!navigator.geolocation) {
    addLog("❌ Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
      });

      addLog("📍 GPS location acquired.");
    },
    (error) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
      }));

      addLog("❌ GPS Error: " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);




  useEffect(() => {
    // 🌐 BACKEND CONNECTION
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch(() => setBackendMessage("Backend unreachable"));

    // 🕒 LIVE CLOCK
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 🎤 SPEECH RECOGNITION ENGINE SETUP
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      // 🎤 WHEN SPEECH IS DETECTED
      recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;

  setInput(transcript);

  addLog("🎤 Voice detected: " + transcript);

  // Automatically send voice to the AI
  await agent.triggerEvent(transcript);
};

      // 🎤 START LISTENING
      recognition.onstart = () => {
        setIsListening(true);
        addLog("🎤 Voice recognition started");
      };

      // 🎤 STOP LISTENING
      recognition.onend = () => {
        setIsListening(false);
        addLog("🎤 Voice recognition stopped");
      };

      // ❌ ERROR HANDLING
      recognition.onerror = (event) => {
        setIsListening(false);
        addLog("❌ Voice Error: " + event.error);
      };
    } else {
      addLog("⚠️ Speech Recognition not supported in this browser.");
    }

    // 🧹 CLEANUP
    return () => {
      clearInterval(timer);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // ===============================
  // 🚀 TRIGGER COMMAND TO AGENT
  // ===============================
  const handleTrigger = () => {
    if (!input.trim()) return;

    agent.triggerEvent(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTrigger();
  };

  // ===============================
  // 🎨 UI HELPERS
  // ===============================
  const severityColor = () => {
    const s = (state.severity || "").toLowerCase();

    if (s === "high" || s === "critical") return "#ef4444";
    if (s === "medium") return "#f59e0b";
    return "#22c55e";
  };

  const threatLevel = state.severity
    ? state.severity.toUpperCase()
    : "LOW";

  const statusLabel = (state.status || "idle").toUpperCase();

  const sevSegments = [
    { color: "#22c55e" },
    { color: "#22c55e" },
    { color: "#f59e0b" },
    { color: "#ef4444" },
  ];
const handleAnchorPress = () => {
  console.log("Anchor pressed");

  if (anchorHoldTimer.current) return;

  anchorHoldTimer.current = setTimeout(() => {
    console.log("🚨 Emergency Activated");
agent.triggerEvent("Emergency button activated");
    // Reset so the button can be used again
    anchorHoldTimer.current = null;
  }, 3000);
};

const handleAnchorRelease = () => {
  console.log("Anchor released");

  if (anchorHoldTimer.current) {
    clearTimeout(anchorHoldTimer.current);
    anchorHoldTimer.current = null;
  }
};
  return (
  <div className="aa-root">

    {/* ── TOP NAV ── */}
    <header className="aa-topnav">
      <div className="aa-topnav-left">
        <span className="aa-topnav-dot" />
        <span className="aa-brand">ANCHOR AGENT</span>
      </div>

      <div className="aa-topnav-center">
        <span className="aa-status-dot green" />
        <span className="aa-status-text">SYSTEM · {statusLabel}</span>
        <div className="aa-sev-wrap">
          <span className="aa-sev-label">SEV</span>
          {sevSegments.map((seg, i) => (
            <span
              key={i}
              className="aa-sev-seg"
              style={{ background: seg.color }}
            />
          ))}
        </div>
      </div>

      <div className="aa-topnav-right">
        <span className="aa-clock">
          {currentTime.toISOString().replace("T", " ").substring(0, 19)} UTC
        </span>
        <div className="aa-uptime-badge">↑ {uptime} UPTIME</div>
      </div>
    </header>

    {/* ── MAIN GRID ── */}
    <main className="aa-main">

      {/* ── CENTER PANEL ── */}
      <section className="aa-center">
        <div className="aa-center-corner top-left">● NODE 01</div>
        <div className="aa-center-corner top-right">NODE 02 ●</div>
        <div className="aa-center-corner bottom-left">● GEO · ZA-01</div>
        <div className="aa-center-corner bottom-right">ENC · AES-256 ●</div>

        <div className="aa-center-body">
          <div className="aa-monitor-label">◇ AI SAFETY MONITOR V2.4.1</div>
          <h1 className="aa-hero-title">Anchor Agent</h1>
          <p className="aa-hero-sub">
            REAL-TIME EMERGENCY RESPONSE SYSTEM
          </p>

          <div className="aa-orb-wrap">
            <div
  className="aa-orb"
  onMouseDown={handleAnchorPress}
  onMouseUp={handleAnchorRelease}
  onMouseLeave={handleAnchorRelease}
  onTouchStart={handleAnchorPress}
  onTouchEnd={handleAnchorRelease}
>
              <div className="aa-orb-core" />
              <div className="aa-orb-ring" />
              <div className="aa-orb-ring aa-orb-ring-2" />
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="aa-stats">
            <div className="aa-stat-card">
              <div className="aa-stat-label">THREAT LEVEL</div>
              <div
                className="aa-stat-value"
                style={{ color: severityColor() }}
              >
                {threatLevel}
              </div>
              <div className="aa-stat-sub">
                {state.severity ? "active event" : "0 active events"}
              </div>
            </div>

            <div className="aa-stat-card">
              <div className="aa-stat-label">RESPONSE LATENCY</div>
              <div className="aa-stat-value cyan">
                {state.timer ? `${state.timer}` : "84"}
                <span className="aa-stat-unit">ms</span>
              </div>
              <div className="aa-stat-sub">avg last 5 min</div>
            </div>

            <div className="aa-stat-card">
              <div className="aa-stat-label">AI CONFIDENCE</div>
              <div className="aa-stat-value cyan">
                97<span className="aa-stat-unit">%</span>
              </div>
              <div className="aa-stat-sub">model certainty</div>
            </div>

            <div className="aa-stat-card">
              <div className="aa-stat-label">CONTACTS ALERTED</div>
              <div className="aa-stat-value cyan">3</div>
              <div className="aa-stat-sub">registered responders</div>
            </div>
          </div>

          {/* INPUT ROW */}
          <div className="aa-input-row">

            {/* 🎤 VOICE BUTTON */}
            <button
              className="aa-btn"
              onClick={toggleVoice}
              title={isListening ? "Stop Listening" : "Start Listening"}
            >
              {isListening ? "🛑" : "🎤"}
            </button>

            <input
              className="aa-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your situation..."
            />

          </div>

          {/* ACTION BUTTONS */}
          <div className="aa-btn-row">
            <button
              className="aa-btn aa-btn-trigger"
              onClick={handleTrigger}
            >
              <span className="aa-btn-icon">⚠</span> Trigger Event
            </button>

            <button
              className="aa-btn aa-btn-safe"
              onClick={() => agent.checkInSafe()}
            >
              <span className="aa-btn-icon">✓</span> I'm Safe
            </button>
          </div>
        </div>
      </section>

      {/* ── RIGHT PANEL ── */}
      <aside className="aa-right">
        <div className="aa-right-top">
          <div className="aa-telemetry-header">
            <span className="aa-status-dot cyan" />
            <span className="aa-telemetry-title">
              TELEMETRY FEED
            </span>
            <span className="aa-live-badge">LIVE</span>
            <span className="aa-entries-count">
              {logs.length || 14} entries
            </span>
          </div>

          <div className="aa-log-scroll" ref={logScrollRef}>
            {logs.length === 0 ? (
              <>
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="aa-log-entry aa-log-placeholder"
                  >
                    <span className="aa-log-time">
                      2026.06.27 · {String(21 - i).padStart(2, "0")}
                      :5{i}:
                      {String(
                        Math.floor(Math.random() * 60)
                      ).padStart(2, "0")} UTC
                    </span>
                  </div>
                ))}
              </>
            ) : (
              logs.map((l, i) => (
                <div key={i} className="aa-log-entry">
                  <span className="aa-log-time">{l.time}</span>
                  <span className="aa-log-text">{l.text}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="aa-activity-section">
          <div className="aa-activity-label">
            ACTIVITY · LAST 14 INTERVALS
          </div>

          <div className="aa-bar-chart">
            {activityBars.map((h, i) => (
              <div
                key={i}
                className="aa-bar"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </aside>

    </main>

    {/* ── FOOTER STATUS BAR ── */}
    <footer className="aa-footer">
      <div className="aa-footer-item">
        <span className="aa-status-dot green" />
        <span className="aa-footer-label">FIREWORKS API ·</span>
        <span className="aa-footer-val">CONNECTED</span>
      </div>

      <div className="aa-footer-item">
        <span className="aa-status-dot green" />
        <span className="aa-footer-label">RELAY ZA-01 ·</span>
        <span className="aa-footer-val">ACTIVE</span>
      </div>

      <div className="aa-footer-item">
        <span className="aa-status-dot green" />
        <span className="aa-footer-label">AI ENGINE ·</span>
        <span className="aa-footer-val">RUNNING</span>
      </div>

      <div className="aa-footer-item">
        <span className="aa-status-dot yellow" />
        <span className="aa-footer-label">SECONDARY NODE ·</span>
        <span className="aa-footer-val">STANDBY</span>
      </div>

      <div className="aa-footer-item">
        <span className="aa-footer-label">
          ANCHOR AGENT · SAFETY OS 2.4.1 · SECURE
        </span>
        <span className="aa-footer-val">CHANNEL</span>
      </div>

      <div className="aa-footer-item">
        <span className="aa-footer-label">
          CR TECH SOLUTIONS
        </span>
        <span className="aa-footer-val">PROPRIETARY</span>
      </div>
    </footer>

  </div>
)};