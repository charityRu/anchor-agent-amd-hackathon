// ===== Anchor Agent Brain (UPGRADED) =====

export const STATES = {
  IDLE: "IDLE",
  ALERT: "ALERT",
  ESCALATING: "ESCALATING",
  SAFE: "SAFE",
  ESCALATED: "ESCALATED",
};

export const initialState = {
  status: STATES.IDLE,
  logs: [],
  countdownActive: false,
};

// log helper (this is IMPORTANT for demo visibility)
export function log(state, message) {
  return {
    ...state,
    logs: [...state.logs, `[${new Date().toLocaleTimeString()}] ${message}`],
  };
}

// 1. Trigger event (duress / activation)
export function triggerAlert(state) {
  let s = { ...state };

  s.status = STATES.ALERT;
  s = log(s, "🚨 ALERT TRIGGERED");
  s = log(s, "📍 Capturing location (simulated)");
  s = log(s, "📨 Preparing emergency message");

  return s;
}

// 2. Start escalation timer (dead-man switch begins)
export function startEscalation(state) {
  let s = { ...state };

  s.status = STATES.ESCALATING;
  s.countdownActive = true;

  s = log(s, "⏳ Escalation timer started (10s demo mode)");
  s = log(s, "👁️ Monitoring user response...");

  return s;
}

// 3. AUTO ESCALATION (THIS IS YOUR WOW MOMENT)
export function autoEscalate(state) {
  let s = { ...state };

  s.status = STATES.ESCALATED;
  s.countdownActive = false;

  s = log(s, "🚨 NO RESPONSE DETECTED");
  s = log(s, "📡 Auto-sending alert to trusted contact (SIMULATED)");
  s = log(s, "🧭 Sharing live location");
  s = log(s, "⚡ Escalation complete");

  return s;
}

// 4. User safe (cancel system)
export function markSafe(state) {
  let s = { ...state };

  s.status = STATES.SAFE;
  s.countdownActive = false;

  s = log(s, "✅ User marked SAFE");
  s = log(s, "🛑 Escalation cancelled");
  s = log(s, "📴 System returning to idle");

  return s;
}