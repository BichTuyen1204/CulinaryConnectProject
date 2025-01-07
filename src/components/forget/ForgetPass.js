import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import "../forget/ForgetPass.css";
import AccountService from "../../api/AccountService";

const ForgotPassword = ({ setShowForgotPass, openLogin }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountId, setAccountId] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError("Please enter your email");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handleReset = async () => {
    if (handleEmailBlur()) {
      return;
    } else {
      try {
        const response = await AccountService.forgotGetOTP(email);
        if (response && response.accountId) {
          setAccountId(response.accountId);
          console.log("Account ID received: ", response.accountId);
          alert("OTP sent successfully!");
        }
      } catch (error) {}
    }
  };

  const handleSubmitPassword = async () => {
    if (!otp || !password || !accountId) {
      alert("Please enter OTP and password.");
      return;
    }

    // Log the form data
    console.log("Submitting form with the following data:");
    console.log({
      accountId: accountId,
      otp: otp,
      password: password,
    });

    try {
      // Call the reset function and pass accountId, OTP, and new password
      await AccountService.forgotReset(accountId, otp, password);
      setShowForgotPass(false); // Close the forgot password modal
    } catch (error) {
      //   alert("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="fullscreen-modal">
      <div className="forgot-password" onClick={() => setShowForgotPass(false)}>
        <form
          className="forgot-password-container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="forgot-password-title">
            <h2>Forgot Password</h2>
            <IoClose onClick={() => setShowForgotPass(false)} />
          </div>

          {/* Email input */}
          <div className="forgot-password-input">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Enter your email"
            />
            {emailError && (
              <p style={{ color: "red", fontSize: "0.9em", marginTop: "5px" }}>
                {emailError}
              </p>
            )}
          </div>

          {!accountId && (
            <div className="part-end-forgot">
              <p>
                Remember password? <span onClick={openLogin}>Login here</span>{" "}
              </p>
            </div>
          )}

          {!accountId && (
            <button
              type="button"
              className="forgot-password-button"
              onClick={handleReset}
            >
              Send OTP
            </button>
          )}

          {/* OTP input */}
          {accountId && (
            <div className="forgot-password-input">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </div>
          )}

          {/* Password input */}
          {accountId && (
            <div className="forgot-password-input">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          )}

          {/* Submit button for password reset */}
          {accountId && (
            <button
              type="button"
              className="forgot-password-button"
              onClick={handleSubmitPassword}
            >
              Reset Password
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
