import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import "../login/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = ({ setShowLogin, openSignUp }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* Receives email */
  const EmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  // Check email
  const ValidEmail = (e) => {
    const emailRegex = /@.*$/;
    return emailRegex.test(e);
  };

  // Check email
  const EmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("Please enter your email");
    } else if (!ValidEmail(email.trim())) {
      setEmailError("Email must contain @ and .com");
    } else if (email.length < 6) {
      setEmailError("Email must be at least 6 characters long");
    } else if (email.length > 100) {
      setEmailError("Email must be less than 100 characters long");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please retype your email");
    } else if (/@[^\w@]+\w/.test(email)) {
      setEmailError("Please retype your email");
    } else if (!/^[^\s@]+@[^\d@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Numbers are not allowed after @.");
    } else {
      setEmailError("");
    }
  };

  /* Receive password */
  const PasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  // Check password
  const PasswordBlur = () => {
    const enteredPassword = password.trim();
    if (enteredPassword === "") {
      setPasswordError("Please enter your password");
    } else if (enteredPassword.length < 6) {
      setPasswordError("Password must be longer than 6 characters");
    } else if (enteredPassword.length > 30) {
      setPasswordError("Password must be shorter than 30 characters");
    } else {
      setPasswordError("");
    }
  };

  // Show and hidden password
  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <form className="login-container">
        <div className="login-title">
          <h2>Login</h2>
          <div className="icon-closeicon-close">
            <IoClose onClick={() => setShowLogin(false)} />
          </div>
        </div>

        <div className="login-input">
          <div className="login-email">
            <input
              type="email"
              name="email"
              value={email}
              onChange={EmailChange}
              onBlur={EmailBlur}
              placeholder="Email"
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          </div>

          <div className="">
            <div className="login-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={PasswordChange}
                onBlur={PasswordBlur}
                placeholder="Password"
              />
              <FontAwesomeIcon
                className="login_ic_eye"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={PasswordVisibility}
              />
            </div>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </div>
        </div>
        <button>Login</button>
        <div className="login-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        <div className="part-end-login">
          <p>
            Create a new account ?{" "}
            <span onClick={openSignUp}>Sign up here</span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;
