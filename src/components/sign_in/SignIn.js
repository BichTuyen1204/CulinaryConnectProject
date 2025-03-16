import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import "../login/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AccountService from "../../api/AccountService";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const [account, setAccount] = useState({
    username: "",
    password: "",
    token: "",
  });

  const closeLogin = () => {
    setIsOpen(false);
    navigate("/");
  };

  if (!isOpen) return null;

  // Receives username
  const userNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setAccount((preState) => ({ ...preState, username: value }));
  };

  // Check full name
  const userNameBlur = () => {
    if (username.trim() === "") {
      setUserNameError("Please enter your full name");
    } else if (username.length < 4) {
      setUserNameError("The full name must be at least 4 characters");
    } else if (username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else {
      setUserNameError("");
    }
  };

  /* Receive password */
  const PasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setAccount((preState) => ({ ...preState, password: value }));
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

  const handleClose = (e) => {
    setIsOpen(false);
    navigate("/");
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  // Check box terms
  const handleAgreementChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  const validateForm = async () => {
    setLoginError("");
    userNameBlur();
    PasswordBlur();

    if (!agreedToTerms) {
      alert(
        "To continue logging in, you need to agree to our Terms of Use and Privacy Policy."
      );
      return;
    }

    if (!userNameError && !passwordError && username && password) {
      try {
        const response = await AccountService.signin(account);
        console.log("Login successful", response);
        setFormSubmitted(true);
        setLoginError("");
        setTimeout(() => {
          closeLogin();
          window.location.reload();
          console.log("Response data:", response);
        }, 1000);
      } catch (error) {
        console.error(
          "Error when logging in:",
          error.response ? error.response.data : error.message
        );
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setUserNameError("Account does not exist.");
              break;
            case 401:
              setLoginError("Invalid username or password.");
              break;
            case 500:
              setPasswordError("Password is incorrect.");
              break;
            default:
              setLoginError("User name does not exist.");
          }
        } else {
          setLoginError("Network error. Please check your connection.");
        }
        setFormSubmitted(false);
      }
    } else {
      alert("Please fill in all fields correctly before submitting.");
    }
  };

  const handleRedirect = () => {
    window.location.href =
      "http://culcon-user-be-30883260979.asia-east2.run.app/oauth2/authorization/google";
  };

  return (
    <div className="fullscreen-modal">
      <div className="login" onClick={handleClose}>
        <form
          className="login-container"
          onClick={handleContainerClick}
          onSubmit={(e) => {
            e.preventDefault();
            // validateForm();
          }}
        >
          <div className="login-title">
            <h2>Login</h2>
            <div className="icon-closeicon-close">
              <IoClose onClick={closeLogin} />
            </div>
          </div>

          <div className="login-input">
            <div className="login-email">
              <input
                type="text"
                name="user name"
                value={username}
                onChange={userNameChange}
                onBlur={userNameBlur}
                placeholder="User name"
              />
              {userNameError && <p style={{ color: "red" }}>{userNameError}</p>}
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

          {/* Check box */}
          <div className="login-condition">
            <input type="checkbox" onChange={handleAgreementChange} />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>

          {/* Forgot password */}
          <div className="forgot-pass">
            <p className="">Forgot password?</p>
          </div>

          {/* Register */}
          <div className="part-end-login">
            <p>
              Create a new account ?{" "}
              <span>
                <Link to="/register">Register here</Link>
              </span>
            </p>
          </div>

          {/* Button login */}
          <div className="button-login">
            {formSubmitted && !loginError && (
              <p style={{ color: "green" }}>Login successful</p>
            )}
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button
              className="login-button"
              type="button"
              onClick={validateForm}
            >
              Login
            </button>
            <div className="text-center p-2">OR</div>
            <button className="button-google" onClick={handleRedirect}>
              Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
