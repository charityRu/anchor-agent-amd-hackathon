const axios = require("axios");

async function analyzeWithAI(text) {
  const aiResponse = await axios.post(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      model: "accounts/fireworks/models/minimax-m3",

      messages: [
        {
          role: "system",
          content: `
You are the AI brain of Anchor Agent.

Your job is to analyse a user's situation and return ONLY valid JSON.

Return exactly this format:

{
  "type":"NORMAL | THREAT | EMERGENCY | SAFE",
  "severity":"NONE | LOW | HIGH | CRITICAL",
  "status":"idle | alert | safe",
  "timer":number|null,
  "actions":["log_location","prepare_alert","urgent_alert","share_location","reset_system"],
  "confidence":0.0
}

Only use the action names listed above.
Return JSON only.
`
        },
        {
          role: "user",
          content: text
        }
      ],

      temperature: 0.2,
      max_tokens: 250
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FIREWORKS_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return JSON.parse(aiResponse.data.choices[0].message.content);
}

module.exports = {
  analyzeWithAI
};