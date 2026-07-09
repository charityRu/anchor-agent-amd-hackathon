// =======================================================
// Anchor Backend (Stage 1 - Foundation Server)
// =======================================================

// =======================================================
// IMPORTS
// =======================================================

// Load environment variables from .env
require("dotenv").config();

// Import Express framework
const express = require("express");

// Import CORS (allows frontend to talk to backend)
const cors = require("cors");

// Import Axios (used to communicate with Fireworks AI)
const axios = require("axios");

const { analyzeWithAI } = require("./services/aiService");

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


app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const aiResponse = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "accounts/fireworks/models/minimax-m3",

        messages: [
          {
            role: "system",
            content: `
You are Anchor Agent's emergency decision engine.

Return ONLY valid JSON.

{
  "type":"NORMAL",
  "severity":"LOW",
  "status":"idle",
  "timer":null,
  "actions":["log_event"],
  "confidence":0.90
}

Rules:
- Return JSON only.
- No markdown.
- No explanations.
- "actions" must contain SHORT machine-readable action names.
`
          },
          {
            role: "user",
            content: text
          }
        ],

        temperature: 0.2,
        max_tokens: 200,
        response_format: {
          type: "json_object"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = aiResponse.data.choices[0].message.content;
    const decision = JSON.parse(content);
    // =====================================================
// STANDARDISE AI OUTPUT
// =====================================================

const actionMap = {
  log_event: "log_location",
  notify_user: "prepare_alert",
  increase_awareness: "increase_awareness",
  scan_surroundings: "increase_awareness",
   track_subject: "increase_awareness",
  prepare_evasion: "prepare_evasion",
  prepare_evasion_route: "prepare_evasion",
  share_live_location: "share_location",
  share_location: "share_location",
  urgent_alert: "urgent_alert",
  call_contact: "call_contact",
  call_emergency: "call_emergency"
 
};

// convert AI actions into Anchor actions
decision.actions = (decision.actions || []).map(
  action => actionMap[action] || action
);

// standardise decision type
const typeMap = {
  NORMAL: "NORMAL",
  SAFE: "SAFE",
  THREAT: "THREAT",
  EMERGENCY: "EMERGENCY",

  SUSPICIOUS: "THREAT",
  SUSPICIOUS_ACTIVITY: "THREAT",

  WARNING: "THREAT",

  CRISIS: "EMERGENCY"
};

decision.type = typeMap[decision.type] || "NORMAL";

// standardise severity
const severityMap = {
  NONE: "NONE",
  LOW: "LOW",
  MEDIUM: "HIGH",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
};

decision.severity =
  severityMap[decision.severity] || "LOW";

    res.json(decision);

  } catch (error) {

    console.error("Fireworks Error:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    res.status(500).json({
      error: "AI decision engine failed."
    });
  }
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