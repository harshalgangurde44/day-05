import { useState } from "react";
import OTPInput from "./OTPInput";
import "./styles.css";

const CORRECT_OTP = "123456";

export default function App() {
  const [otp, setOtp] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  function handleVerify(value = otp) {
    if (!/^\d{6}$/.test(value)) {
      setMessage("Please enter all 6 digits.");
      setStatus("error");
      return;
    }

    if (value === CORRECT_OTP) {
      setMessage("OTP verified successfully!");
      setStatus("success");
    } else {
      setMessage("Incorrect OTP. Please try again.");
      setStatus("error");
    }
  }

  function handleOtpChange(value) {
    setOtp(value);

    // Clear old messages when the user edits the OTP.
    setMessage("");
    setStatus("idle");
  }

  function handleReset() {
    setOtp("");
    setMessage("");
    setStatus("idle");
    setResetKey((previous) => previous + 1);
  }

  return (
    <main className="page">
      <section className="otp-card">
        <div className="icon-circle">🔐</div>

        <h1>Verify your account</h1>

        <p className="description">
          Enter the 6-digit verification code.
        </p>

        <OTPInput
          key={resetKey}
          length={6}
          onChange={handleOtpChange}
          onComplete={handleVerify}
        />

        {message && (
          <p
            className={`message ${status}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <button
          className="verify-btn"
          onClick={() => handleVerify()}
          disabled={!/^\d{6}$/.test(otp)}
        >
          Verify OTP
        </button>

        <button
          className="reset-btn"
          onClick={handleReset}
        >
          Reset OTP
        </button>

        <p className="hint">
          Demo OTP: <strong>123456</strong>
        </p>
      </section>
    </main>
  );
}
