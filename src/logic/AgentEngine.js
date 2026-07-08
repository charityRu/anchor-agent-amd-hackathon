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
    actions.forEach((action) => {
      switch (action) {
        case "log_location":
          this.addLog("📍 GPS MODULE: Capturing location...");
          break;

        case "prepare_alert":
          this.addLog("📨 Messaging module preparing alert...");
          break;

        case "reset_system":
          this.addLog("🔄 System reset executed");
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