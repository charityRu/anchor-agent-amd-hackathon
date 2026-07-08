/**
 * ============================================================
 * AnchorVoiceEngine
 * ------------------------------------------------------------
 * Central voice service for Anchor Agent.
 *
 * Responsibilities:
 * - Detect voice capabilities
 * - Manage microphone state
 * - Abstract speech providers
 * - Support future online/offline speech engines
 *
 * NOTE:
 * This first version only creates the architecture.
 * Recording and transcription will be added in the next steps.
 * ============================================================
 */

export class AnchorVoiceEngine {
  constructor() {
    this.isListening = false;
    this.provider = null;
  }

  /**
   * Check if the browser supports native speech recognition.
   * Firefox currently returns false, which is expected.
   */
  supportsNativeSpeech() {
    return !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    );
  }

  /**
   * Returns information about the current voice engine.
   */
  getStatus() {
    return {
      listening: this.isListening,
      nativeSupport: this.supportsNativeSpeech(),
      provider: this.provider,
    };
  }

  /**
   * Placeholder for starting voice capture.
   * The implementation comes in the next stage.
   */
  async start() {
    console.log("[AnchorVoiceEngine] Start requested.");
  }

  /**
   * Placeholder for stopping voice capture.
   */
  stop() {
    console.log("[AnchorVoiceEngine] Stop requested.");
  }
}