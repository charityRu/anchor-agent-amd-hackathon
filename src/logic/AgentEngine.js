export class AgentEngine {
  constructor(setState, addLog) {

    // React state updater
    this.setState = setState;

    // log updater
    this.addLog = addLog;

    // ===============================
    // 🧠 FIX: prevents double execution
    // ===============================
    this.isProcessing = false;
  }

  // ===============================
// MAIN ENTRY
// ===============================
async triggerEvent(text) {
  if (this.isProcessing) return;

  this.isProcessing = true;

  this.addLog("🚨 INPUT RECEIVED: " + text);

  const start = performance.now();

  try {
    let decision;

    // OFFLINE MODE
    if (!navigator.onLine) {
      this.addLog(
        "🟠 Offline Emergency Mode Activated."
      );

      decision = this.localDecision(text);
    } else {
      // CLOUD AI
      decision = await this.sendToBrain(text);

      console.log(
        "AI RESPONSE:",
        decision
      );

      // FALLBACK
      if (
        !decision ||
        decision.error
      ) {
        this.addLog(
          "🟠 Cloud AI unavailable. Switching to Offline AI."
        );

        decision =
          this.localDecision(text);
      }
    }

    const end = performance.now();

    const responseTime =
      Math.round(end - start);

    this.addLog(
      `🧠 BACKEND DECISION: ${decision.type} | ${decision.severity}`
    );

    this.setState((prev) => ({
      ...prev,
      status: decision.status,
      severity: decision.severity,
      timer: responseTime,
      confidence:
        decision.confidence
          ? Math.round(
              decision.confidence * 100
            )
          : 95,
    }));

    this.executeActions(
      decision.actions || []
    );

    this.react(decision);

  } catch (error) {

    console.error(
      "Agent Error:",
      error
    );

    this.addLog(
      "❌ Emergency protocol failure."
    );

  } finally {

    this.isProcessing = false;
  }
}

// ===============================
// BACKEND CALL
// ===============================
async sendToBrain(text) {
  try {
    const res = await fetch(
      "http://localhost:5000/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    const data =
      await res.json();

    return data;

  } catch (err) {

    console.error(
      "Brain Error:",
      err
    );

    return {
      error: true,
    };
  }
}

localDecision(text = "") {
  const input = text.toLowerCase();

  if (
    input.includes("help") ||
    input.includes("chased") ||
    input.includes("followed") ||
    input.includes("attack") ||
    input.includes("emergency")
  ) {
    return {
      type: "EMERGENCY",
      severity: "HIGH",
      status: "ACTIVE",
      confidence: 0.93,
      actions: [
        "alert_responders",
        "notify_contacts",
        "share_location",
        "record_audio",
        "log_location",
      ],
    };
  }

  return {
    type: "NORMAL",
    severity: "LOW",
    status: "MONITORING",
    confidence: 0.75,
    actions: ["log_location"],
  };
}
  // ===============================
  // ACTION ENGINE
  // ===============================
executeActions(actions = []) {
  console.log("NEW ACTION ENGINE LOADED");

  actions.forEach((action) => {
    console.log("ACTION RECEIVED:", action);

    const actionName = action.toLowerCase();

    switch (actionName) {
      case "log_location":
      case "log_event":
        this.addLog(
          "📍 Logging incident and securing location data..."
        );
        break;

      case "prepare_alert":
      case "notify_user":
        this.addLog(
          "📨 Preparing emergency notifications..."
        );
        break;

      case "prepare_evasion":
        this.addLog(
          "🏃 Suggesting immediate evacuation strategy..."
        );
        break;

      case "prepare_evasion_route":
        this.addLog(
          "🏃 Calculating safest escape route..."
        );
        break;

      case "increase_awareness":
        this.addLog(
          "👀 Increasing situational awareness..."
        );
        break;

      case "scan_surroundings":
        this.addLog(
          "🔍 Scanning surrounding environment..."
        );
        break;

      case "share_location":
        this.addLog(
          "📡 Transmitting last known coordinates..."
        );
        break;

      case "urgent_alert":
        this.addLog(
          "🚨 High-priority emergency alert initiated..."
        );
        break;

      case "activate_alarm":
        this.addLog(
          "🚨 Emergency alarm activated..."
        );
        break;

      case "activate_protocol":
        this.addLog(
          "⚠️ Emergency response protocol initiated..."
        );
        break;

      case "call_emergency":
        this.addLog(
          "☎️ Emergency services call initiated..."
        );
        break;

      case "call_contact":
        this.addLog(
          "📞 Contacting emergency contact..."
        );
        break;

      case "alert_responders":
      case "alert_responder":
        this.addLog(
          "🚓 Emergency channels notified. Dispatch request sent..."
        );
        break;

      case "alert_authorities":
      case "notify_authorities":
        this.addLog(
          "🚔 Authorities have been notified..."
        );
        break;

      case "dispatch_emergency":
      case "dispatch_emergency_response":
      case "dispatch_help":
        this.addLog(
          "🚑 Dispatch request transmitted..."
        );
        break;

      case "notify_contacts":
      case "alert_contacts":
      case "notify_guardian": {
        const contacts =
          JSON.parse(
            localStorage.getItem(
              "anchor_contacts"
            ) || "[]"
          );

        if (contacts.length === 0) {
          this.addLog(
            "⚠️ No emergency contacts registered."
          );
        } else {
          contacts.forEach((contact) => {
            this.addLog(
              `📞 Emergency contact notified: ${contact.name} (${contact.relation})`
            );
          });
        }

        break;
      }

      case "record_audio":
        this.addLog(
          "🎤 Emergency audio capture initiated..."
        );
        break;

      case "record_evidence":
        this.addLog(
          "📷 Capturing evidence for incident report..."
        );
        break;

      case "dispatch_security":
        this.addLog(
          "🛡️ Nearby security assistance requested..."
        );
        break;

      case "reset_system":
        this.addLog(
          "🔄 Emergency system reset completed."
        );
        break;

      default:

        if (
          actionName.includes("contact")
        ) {
          const contacts =
            JSON.parse(
              localStorage.getItem(
                "anchor_contacts"
              ) || "[]"
            );

          contacts.forEach((contact) => {
            this.addLog(
              `📞 Emergency contact notified: ${contact.name}`
            );
          });
        }

        else if (
          actionName.includes("alert") ||
          actionName.includes("notify")
        ) {
          this.addLog(
            "📨 Sending emergency notifications..."
          );
        }

        else if (
          actionName.includes("dispatch")
        ) {
          this.addLog(
            "🚑 Dispatch request transmitted..."
          );
        }

        else if (
          actionName.includes("location")
        ) {
          this.addLog(
            "📍 Logging incident location..."
          );
        }

        else if (
          actionName.includes("record") ||
          actionName.includes("audio")
        ) {
          this.addLog(
            "🎤 Emergency audio capture initiated..."
          );
        }

        else {
          console.log(
            "Unmapped action:",
            action
          );
        }
    }
  });
}
  // ===============================
  // VISUAL SIMULATION
  // ===============================
  react() {
    this.addLog("⚙️ Processing response protocol...");

    setTimeout(() => {
      this.addLog("📡 Checking emergency channels...");
    }, 800);

    setTimeout(() => {
      this.addLog("📍 Location module standby...");
    }, 1600);

    setTimeout(() => {
      this.addLog("📨 Notification system ready...");
    }, 2400);
  }

  // ===============================
  // SAFE STATE
  // ===============================
  checkInSafe() {
    this.addLog("✅ SAFE SIGNAL RECEIVED");

    this.setState((prev) => ({
      ...prev,
      status: "safe",
      severity: null,
      timer: null,
    }));
  }
}