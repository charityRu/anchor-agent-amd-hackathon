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

    // prevent duplicate calls
    if (this.isProcessing) return;

    this.isProcessing = true;

    this.addLog("🚨 INPUT RECEIVED: " + text);

    try {

      const decision = await this.sendToBrain(text);

      this.addLog(
        `🧠 BACKEND DECISION: ${decision.type} | ${decision.severity}`
      );

      // update UI
      this.setState((prev) => ({
        ...prev,
        status: decision.status,
        severity: decision.severity,
        timer: decision.timer,
      }));

      // execute actions
      this.executeActions(decision.actions);

      // visual pipeline
      this.react(decision);

    } finally {
      // release lock
      this.isProcessing = false;
    }
  }

  // ===============================
  // BACKEND CALL
  // ===============================
  async sendToBrain(text) {
    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    return await res.json();
  }

  // ===============================
  // ACTION ENGINE
  // ===============================
executeActions(actions = []) {
  console.log("NEW ACTION ENGINE LOADED");
  actions.forEach((action) => {
console.log("ACTION RECEIVED:", action);
    switch (action) {

      case "log_location":
      case "log_event":
        this.addLog("📍 Logging incident and current location...");
        break;

      case "prepare_alert":
      case "notify_user":
        this.addLog("📨 Preparing emergency notification...");
        break;

      case "prepare_evasion":
        this.addLog("🏃 Suggesting escape route...");
        break;

      case "increase_awareness":
        this.addLog("👀 Increasing situational awareness...");
        break;

      case "share_location":
        this.addLog("📡 Sharing live GPS location...");
        break;

      case "urgent_alert":
        this.addLog("🚨 Dispatching urgent emergency alert...");
        break;

      case "call_emergency":
        this.addLog("☎️ Contacting emergency services...");
        break;

      case "call_contact":
        this.addLog("👤 Contacting emergency contact...");
        break;
      case "alert_responders":
  this.addLog("🚓 Alerting emergency responders...");
  break;
  
  case "alert_authorities":
  this.addLog("🚔 Alerting local authorities...");
  break;

case "dispatch_emergency":
  this.addLog("🚑 Dispatching emergency response...");
  break;

case "notify_contacts":
  this.addLog("👥 Notifying emergency contacts...");
  break;

case "record_audio":
  this.addLog("🎤 Starting emergency audio recording...");
  break;  

      case "reset_system":
        this.addLog("🔄 System reset executed.");
        break;
      case "scan_surroundings":
  this.addLog("🔍 Scanning surrounding area...");
  break;

case "prepare_evasion_route":
  this.addLog("🏃 Calculating safest escape route...");
  break;


      default:
        this.addLog("⚠️ Unknown action: " + action);

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