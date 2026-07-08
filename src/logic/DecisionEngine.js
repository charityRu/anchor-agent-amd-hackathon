// ==========================================================
// DecisionEngine.js (Simple Intelligence Layer)
// ==========================================================

export function analyseDecision(text) {
  const lower = text.toLowerCase();

  if (lower.includes("follow") || lower.includes("danger")) {
    return {
      type: "THREAT",
      severity: "HIGH",
      status: "alert",
      timer: 30,
    };
  }

  if (lower.includes("help") || lower.includes("emergency")) {
    return {
      type: "EMERGENCY",
      severity: "CRITICAL",
      status: "alert",
      timer: 15,
    };
  }

  return {
    type: "NORMAL",
    severity: "LOW",
    status: "idle",
    timer: null,
  };
}