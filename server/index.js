// =======================================================
// Anchor Backend (Stage 1 - Foundation Server)
// =======================================================

// Import Express framework
const express = require("express");

// Import CORS (allows frontend to talk to backend)
const cors = require("cors");

// Create Express app instance
const app = express();

// =======================================================
// MIDDLEWARE (setup layer)
// =======================================================

// Allow cross-origin requests from React frontend
app.use(cors());

// Allow backend to read JSON requests
app.use(express.json());

// =======================================================
// ROUTES (what the frontend can call)
// =======================================================

// Health check route (used to test connection)
app.get("/", (req, res) => {
  res.json({
    message: "Anchor Backend is running!",
    status: "online",
  });
});
// =======================================================
// 🧠 AGENT BRAIN v2 (STRUCTURED DECISION ENGINE)
// =======================================================

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  const input = text.toLowerCase();

  // =====================================================
  // BASE RESPONSE STRUCTURE (IMPORTANT FOR SCALING)
  // =====================================================
  let response = {
    type: "NORMAL",
    severity: "LOW",
    status: "idle",
    timer: null,

    // 🧠 NEW: future-proof fields (important for later)
    actions: [],
    confidence: 0,
  };

  // =====================================================
  // RULE 1: HIGH THREAT SCENARIO
  // =====================================================
  if (input.includes("follow") || input.includes("danger")) {
    response = {
      type: "THREAT",
      severity: "HIGH",
      status: "alert",
      timer: 30,

      actions: ["log_location", "prepare_alert"],
      confidence: 0.85,
    };
  }

  // =====================================================
  // RULE 2: EMERGENCY SCENARIO
  // =====================================================
  if (input.includes("help") || input.includes("emergency")) {
    response = {
      type: "EMERGENCY",
      severity: "CRITICAL",
      status: "alert",
      timer: 15,

      actions: ["urgent_alert", "share_location"],
      confidence: 0.95,
    };
  }

  // =====================================================
  // RULE 3: SAFE / RESET SCENARIO
  // =====================================================
  if (input.includes("safe") || input.includes("okay")) {
    response = {
      type: "SAFE",
      severity: "NONE",
      status: "safe",
      timer: null,

      actions: ["reset_system"],
      confidence: 0.9,
    };
  }

  // =====================================================
  // RETURN DECISION OBJECT
  // =====================================================
  res.json(response);
});
// =======================================================
// START SERVER
// =======================================================

// Port where backend runs
const PORT = 5000;

// Start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Anchor Backend running on port ${PORT}`);
});