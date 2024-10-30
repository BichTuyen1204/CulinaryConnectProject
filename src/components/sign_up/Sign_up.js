import "../sign_up/Sign_up.css";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Sign_up = ({ setShowSignUp, openLogin }) => {
  const [fullName, setFullname] = useState("");
  const [fullNameError, setFullnameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [checkPass, setCheckPass] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);


  const [account, setAccount] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Receive full name
  const FullnameChange = (e) => {
    const value = e.target.value;
    setFullname(value);
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  // Check full name
  const FullnameBlur = () => {
    if (fullName.trim() === "") {
      setFullnameError("Please enter your full name");
    } else if (fullName.length < 4) {
      setFullnameError("The full name must be at least 4 characters");
    } else if (fullName.length > 100) {
      setFullnameError("The full name must be less than 100 characters");
    } else if (!/^[\p{L}\s]+$/u.test(fullName)) {
      setFullnameError("Please enter only alphabetic characters");
    } else {
      setFullnameError("");
    }
  };

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

  // Receive re-password
  const ConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setRePassword(value);
    if (value === "") {
      setPasswordError("");
      setCheckPass(false);
    } else if (value !== password) {
      setPasswordError("");
      setCheckPass(true);
    } else {
      setPasswordError("");
      setCheckPass(false);
    }
  };

  // Check re-password
  const RePasswordBlur = () => {
    const enteredRePassword = rePassword.trim();
    if (enteredRePassword === "") {
      setRePasswordError("Please enter your password");
    } else if (enteredRePassword.length < 6 || enteredRePassword.length > 30) {
      setRePasswordError("Password must be between 6 and 30 characters");
    } else {
      setRePasswordError("");
    }
  };

  // Show and hidden re-password
  const RePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
};

  return (
    <div className="sign-up">
      <form className="sign-up-container">
        <div className="sign-up-title">
          <h2>Sign Up</h2>
          <div className="icon-closeicon-close">
            <IoClose onClick={() => setShowSignUp(false)} />
          </div>
        </div>

        <div className="sign-up-input">
          <div className="sign-up-email">
            <input
              type="text"
              name="name"
              value={fullName}
              onChange={FullnameChange}
              onBlur={FullnameBlur}
              placeholder="Full name"
              className="form-control"
            />
            {fullNameError && <p style={{ color: "red" }}>{fullNameError}</p>}
          </div>

          <div className="sign-up-email">
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

          <div className="password">
            <div className="sign-up-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={PasswordChange}
                onBlur={PasswordBlur}
                placeholder="Password"
              />
              <FontAwesomeIcon
                className="sign-up_ic_eye"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={PasswordVisibility}
              />
            </div>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </div>

          <div className="re-password">
            <div className="sign-up-password">
              <input
                type={showRePassword ? "text" : "password"}
                name="rePassword"
                value={rePassword}
                onChange={ConfirmPasswordChange}
                onBlur={RePasswordBlur}
                placeholder="Re-enter password"
              />
              <FontAwesomeIcon
                className="sign-up_ic_eye"
                icon={showRePassword ? faEyeSlash : faEye}
                onClick={RePasswordVisibility}
              />
            </div>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          </div>

        </div>
        <button>Sign Up</button>
        <div className="sign-up-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        <div className="part-end-sign-up">
          <p>
            Have a new account ? <span onClick={openLogin}>Login here</span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Sign_up;
