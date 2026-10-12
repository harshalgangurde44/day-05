
import { useEffect, useRef, useState } from "react";

export default function OTPInput({
  length = 6,
  onComplete,
  onChange,
}) {
  const [otp, setOtp] = useState(() => Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function updateOtp(nextOtp, focusIndex) {
    setOtp(nextOtp);
    onChange?.(nextOtp.join(""));

    if (focusIndex !== undefined) {
      inputRefs.current[focusIndex]?.focus();
    }
  }

  function handleChange(value, index) {
    const digits = value.replace(/\D/g, "");
    const nextOtp = [...otp];

    if (!digits) {
      nextOtp[index] = "";
      updateOtp(nextOtp);
      return;
    }

    // Enter a single digit and move forward.
    if (digits.length === 1) {
      nextOtp[index] = digits;
      updateOtp(
        nextOtp,
        Math.min(index + 1, length - 1)
      );
      return;
    }

    // Handle multiple digits inserted together.
    handlePaste(digits, index);
  }

  function handlePaste(value, index = 0) {
    const digits = value.replace(/\D/g, "");
    const nextOtp = [...otp];

    digits.slice(0, length - index).split("").forEach(
      (digit, offset) => {
        nextOtp[index + offset] = digit;
      }
    );

    updateOtp(
      nextOtp,
      Math.min(index + digits.length, length - 1)
    );
  }

  function handleKeyDown(event, index) {
    if (event.key === "Backspace") {
      event.preventDefault();

      const nextOtp = [...otp];

      if (nextOtp[index]) {
        nextOtp[index] = "";
        updateOtp(nextOtp);
      } else if (index > 0) {
        nextOtp[index - 1] = "";
        updateOtp(nextOtp, index - 1);
      }

      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }

    if (event.key === "Enter") {
      event.preventDefault();
      onComplete?.(otp.join(""));
    }
  }

  return (
    <div className="otp-inputs">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          className="otp-box"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`OTP digit ${index + 1}`}
          maxLength={length}
          value={digit}
          onChange={(event) =>
            handleChange(event.target.value, index)
          }
          onKeyDown={(event) =>
            handleKeyDown(event, index)
          }
          onPaste={(event) => {
            event.preventDefault();
            handlePaste(
              event.clipboardData.getData("text"),
              index
            );
          }}
        />
      ))}
    </div>
  );
}
