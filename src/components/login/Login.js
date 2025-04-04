import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import "../login/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AccountService from "../../api/AccountService";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;

const Login = ({
  setShowLogin,
  openSignUp,
  onLoginSuccess,
  openForgotPass,
}) => {
  const [username, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  // Receives username
  const userNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    setUserName(value);
    setAccount((preState) => ({ ...preState, username: value }));
    setUserNameError("");
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
    setPasswordError("");
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
    setShowLogin(false);
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  const validateForm = async () => {
    setLoginError("");
    userNameBlur();
    PasswordBlur();
    if (!userNameError && !passwordError && username && password) {
      try {
        const response = await AccountService.signin(account);
        setFormSubmitted(true);
        setLoginError("");
        setTimeout(() => {
          onLoginSuccess();
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
            case 423:
              setUserNameError("Account is banned.");
              break;
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
    window.location.href = `${REACT_APP_BACKEND_API_ENDPOINT}/oauth2/authorization/google`;
  };

  return (
    <div className="fullscreen-modal">
      <div className="login" onClick={handleClose}>
        <form
          className="login-container"
          onClick={handleContainerClick}
          onSubmit={(e) => {
            e.preventDefault();
            validateForm();
          }}
        >
          <div className="login-title">
            <h2>Login</h2>
            <div className="icon-closeicon-close">
              <IoClose onClick={() => setShowLogin(false)} />
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

          {/* Forgot password */}
          <div className="forgot-pass mt-1">
            <p
              onClick={openForgotPass}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              Forgot password?
            </p>
          </div>

          {/* Register */}
          <div className="part-end-login">
            <p>
              Create a new account ?{" "}
              <span onClick={openSignUp}>Register here</span>
            </p>
          </div>

          {/* Button login */}
          <div className="button-login">
            {formSubmitted && !loginError && (
              <p
                style={{
                  color: "green",
                  fontWeight: "500",
                  marginBottom: "5px",
                }}
              >
                Login successful
              </p>
            )}
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button
              className="login-form-button"
              type="submit"
              onClick={validateForm}
            >
              Login
            </button>
            <div className="text-center p-2 text-or-login">OR</div>
            <button className="button-google" type="button" onClick={handleRedirect}>
              Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
