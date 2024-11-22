import "../sign_up/Sign_up.css";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import AccountService from "../../api/AccountService";

const Sign_up = ({ setShowSignUp, openLogin }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [checkPass, setCheckPass] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [account, setAccount] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    description: "",
  });

  // Receive full name
  const NameChange = (e) => {
    const { value } = e.target;
    setName(value);
    setAccount((preState) => ({ ...preState, username: value }));
  };

  // Check full name
  const NameBlur = () => {
    if (name.trim() === "") {
      setNameError("Please enter your full name");
    } else if (name.length < 4) {
      setNameError("The full name must be at least 4 characters");
    } else if (name.length > 100) {
      setNameError("The full name must be less than 100 characters");
    } else if (!/^[\p{L}\s]+$/u.test(name)) {
      setNameError("Please enter only alphabetic characters");
    } else {
      setNameError("");
    }
  };

  // Receives email
  const EmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setAccount((preState) => ({ ...preState, email: value }));
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

  // Receive phone number
  const PhoneChange = (e) => {
    const { value } = e.target;
    setPhone(value);
    setAccount((preState) => ({ ...preState, phone: value }));
  };

  // Check phone number
  const PhoneBlur = () => {
    if (phone.trim() === "") {
      setPhoneError("Please enter your phone number");
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Your phone number just only number");
    } else if (!/^0/.test(phone)) {
      setPhoneError("Phone number must start with 0");
    } else {
      setPhoneError("");
    }
  };

  // Receive address
  const AddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);
    setAccount((preState) => ({ ...preState, address: value }));
  };

  const AddressBlur = () => {
    if (address.trim() === "") {
      setAddressError("Please enter your address");
    } else {
      setAddressError("");
    }
  };

  // Receive password
  const PasswordChange = (e) => {
    const { value } = e.target;
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

  // Receive description
  const DescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    setAccount((preState) => ({ ...preState, description: value }));
  };

  const DescriptionBlur = () => {
    if (description.trim() === "") {
      setDescriptionError("Please enter your description");
    } else {
      setDescriptionError("");
    }
  };

  // Submit
  const validateForm = async () => {
    NameBlur();
    EmailBlur();
    PhoneBlur();
    PasswordBlur();
    RePasswordBlur();
    AddressBlur();

    if (
      !nameError &&
      !emailError &&
      !phoneError &&
      !passwordError &&
      !rePasswordError &&
      !addressError &&
      name &&
      email &&
      phone &&
      password &&
      rePassword &&
      address &&
      description &&
      !checkPass
    ) {
      setFormSubmitted(true);
      try {
        const response = AccountService.register(account);
        console.log("Account created", response.data);
      } catch (error) {
        console.error("Have error when create an account", error);
      }
      console.log("Submitted Data:", {
        name,
        email,
        phone,
        password, // Cân nhắc không log mật khẩu vì lý do bảo mật
        address,
        description
    });
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRePassword("");
      setAddress("");
      setDescription("");

      setTimeout(() => {
        openLogin();
        setFormSubmitted(false);
      }, 5000);
    } else {
      alert("Please fill in all fields correctly before submitting.");
    }
  };

  const handleClose = (e) => {
    setShowSignUp(false);
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="sign-up" onClick={handleClose}>
      <form className="sign-up-container" onClick={handleContainerClick}>
        <div className="sign-up-title">
          <h2>Register</h2>
          <div className="icon-closeicon-close">
            <IoClose onClick={() => setShowSignUp(false)} />
          </div>
        </div>

        {/* Input full name */}
        <div className="sign-up-input">
          <div className="sign-up-email">
            <input
              type="name"
              name="name"
              value={name}
              onChange={NameChange}
              onBlur={NameBlur}
              placeholder="Full name"
            />
            {nameError && <p style={{ color: "red" }}>{nameError}</p>}
          </div>

          {/* Input email */}
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

          {/* Input phone number */}
          <div className="phone-number">
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={PhoneChange}
              onBlur={PhoneBlur}
              placeholder="Phone number"
            />
            {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
          </div>

          {/* Input password */}
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

          {/* Input re-password */}
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
            {checkPass && (
              <p style={{ color: "red" }}>Your password not match</p>
            )}

            {rePasswordError && (
              <p style={{ color: "red" }}>{rePasswordError}</p>
            )}
          </div>

          {/* Input address */}
          <div className="address">
            <input
              type="text"
              name="address"
              value={address}
              onChange={AddressChange}
              onBlur={AddressBlur}
              placeholder="Address"
            />
            {addressError && <p style={{ color: "red" }}>{addressError}</p>}
          </div>

          {/* Input description */}
          <div className="description">
            <input
              type="text"
              name="description"
              value={description}
              onChange={DescriptionChange}
              onBlur={DescriptionBlur}
              placeholder="Description"
            />
            {addressError && <p style={{ color: "red" }}>{addressError}</p>}
          </div>
        </div>

        <div className="sign-up-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        <div className="part-end-sign-up">
          <p>
            Have a new account ? <span onClick={openLogin}>Login here</span>
          </p>
        </div>

        <div>
          {formSubmitted && (
            <p style={{ color: "green" }}>Register successful</p>
          )}
          <button type="button" onClick={validateForm}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
export default Sign_up;
