import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import "../forget/ForgetPass.css";
import AccountService from "../../api/AccountService"; // Make sure to import your AccountService

const ForgotPassword = ({ setShowForgotPass }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountId, setAccountId] = useState(null); // State to store accountId
  const [otp, setOtp] = useState(""); // State to store OTP
  const [password, setPassword] = useState(""); // State to store new password

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleReset = async () => {
    if (!emailError && email) {
      try {
        // Make the request to get OTP
        const response = await AccountService.forgotGetOTP(email);
        if (response && response.accountId) {
          setAccountId(response.accountId); // Store accountId in the state
          console.log("Account ID received: ", response.accountId); // Log accountId
          alert("OTP sent successfully!");
        }
      } catch (error) {
        // alert("Error sending OTP. Please try again.");
      }
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
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          </div>
          <button
            type="button"
            className="forgot-password-button"
            onClick={handleReset}
          >
            Send OTP
          </button>

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
