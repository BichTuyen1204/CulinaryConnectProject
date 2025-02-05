import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import { Link, useNavigate } from "react-router-dom";
import AccountService from "../../api/AccountService";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPen } from "react-icons/fa6";

export const EditProfile = () => {
  const [username, setUserName] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imgUser, setImgUser] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [oldPassError, setOldPassError] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [checkPass, setCheckPass] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmittedPass, setFormSubmittedPass] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [activeTab, setActiveTab] = useState("profile");
  const [noChangeError, setNoChangeError] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPhone, setInitialPhone] = useState("");
  const [initialAddress, setInitialAddress] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [otpVisible, setOtpVisible] = useState(false);

  const [account, setAccount] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    oldPassword: "",
    password: "",
    profilePictureUri: "",
    url: "",
  });

  const ImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setAccount((preState) => ({
      ...preState,
      url: previewUrl,
    }));

    setImgUser(file);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await AccountService.updateImage(formData);
      console.log("Response from server:", response);

      if (response && response.url) {
        setAccount((prevState) => ({
          ...prevState,
          profilePictureUri: response.url,
        }));
        alert("Profile picture updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to retrieve new profile picture URL.");
      }
    } catch (error) {
      console.error("Image update failed: ", error);
      alert("Failed to update image.");
    }
  };

  // Receive full name
  const NameChange = (e) => {
    const { value } = e.target;
    setUserName(value);
    setAccount((preState) => ({ ...preState, username: value }));
  };

  // Check full name
  const NameBlur = () => {
    if (username.trim() === "") {
      setUserNameError("Please enter your full name");
    } else if (username.length < 4) {
      setUserNameError("The full name must be at least 4 characters");
    } else if (username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else if (!/^[\p{L}\s]+$/u.test(username)) {
      setUserNameError("Please enter only alphabetic characters");
    } else {
      setUserNameError("");
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

  const updateEmailOnly = async () => {
    EmailBlur();
    if (!emailError && email) {
      try {
        const response = await AccountService.updateInfo({ email });
        console.log("Email updated", response);
        alert("Email updated successfully!");
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data?.message;
          if (errorMessage?.includes("email")) {
            setEmailError("Email already exists.");
          } else {
            setEmailError("Failed to update email.");
          }
        }
      }
    }
  };

  const [accountId, setAccountId] = useState(null); 
  const handleVisibleOTP = async () => {
    try {
      const response = await AccountService.updateEmailOTP(email);

      if (response) {
        setAccountId(response.accountId);
        setOtpVisible(true);
      }
    } catch (error) {
  
      alert("Error: " + (error.response ? error.response.data.messages : error.message));
    }
  };
  

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };


  const handleSubmitOtp = async () => {
    if (!accountId) {
      alert("Account ID is missing. Please request an OTP first.");
      return;
    }
    try {
      const response = await AccountService.updateEmail(accountId, email, otp);

      console.log('OTP submitted:', otp);
      setOtpVisible(false);
  
      if (response) {
        alert("Email successfully updated!");
      }
    } catch (error) {
      alert("Error: " + (error.response ? error.response.data.messages : error.message));
    }
  };

  const handleCloseOtpPanel = () => {
    setOtpVisible(false);
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
    } else if (phone.length < 10 || phone.length > 10) {
      setPhoneError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(phone)) {
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

  // Receive description
  const DescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    setAccount((preState) => ({ ...preState, description: value }));
  };

  // Receive old password
  const OldPasswordChange = (e) => {
    const { value } = e.target;
    setOldPass(value);
    setAccount((preState) => ({ ...preState, oldPassword: value }));
  };

  // Check old password
  const OldPassBlur = () => {
    const enteredPassword = oldPass.trim();
    if (enteredPassword === "") {
      setOldPassError("Please enter your old password");
    } else if (enteredPassword.length < 6) {
      setOldPassError("Password must be longer than 6 characters");
    } else if (enteredPassword.length > 30) {
      setOldPassError("Password must be less than 30 characters");
    } else if (enteredPassword === password) {
      setOldPassError("Old password cannot be the same as new password");
    } else {
      setOldPassError("");
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
      setPasswordError("Password must be less than 30 characters");
    } else if (enteredPassword === oldPass) {
      setPasswordError("New password cannot be the same as old password");
    } else {
      setPasswordError("");
    }
  };

  // Receive re-password
  const ConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setRePassword(value);
  };

  // Check re-password
  const RePasswordBlur = () => {
    const enteredRePassword = rePassword.trim();
    if (enteredRePassword === "") {
      setRePasswordError("Please enter your password");
    } else if (enteredRePassword.length < 6 || enteredRePassword.length > 30) {
      setRePasswordError("Password must be between 6 and 30 characters");
    } else if (enteredRePassword !== password) {
      setRePasswordError("The password do not match");
    } else {
      setRePasswordError("");
    }
  };

  // Show and hidden re-password
  const RePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  // Show and hidden password
  const PasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const OldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  //Call infor
  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
      return;
    } else {
      const getAccount = async () => {
        try {
          const response = await AccountService.account(jwtToken);
          setAccount(response);
          setUserName(response.username);
          setEmail(response.email);
          setPhone(response.phone);
          setAddress(response.address);
          setDescription(response.profileDescription);
          setImgUser(response.profilePictureUri);
          setInitialUsername(response.username);
          setInitialEmail(response.email);
          setInitialPhone(response.phone);
          setInitialAddress(response.address);
          setInitialDescription(response.profileDescription);
        } catch (error) {
          console.error("Error fetching account information:", error);
        }
      };
      getAccount();
    }
  }, [jwtToken, navigate]);

  //Check user input something or not
  const handleUserChange = () => {
    if (
      username === initialUsername &&
      email === initialEmail &&
      phone === initialPhone &&
      address === initialAddress &&
      description === initialDescription
    ) {
      setNoChangeError("Please change at least one field to save.");
      return false;
    }
    setNoChangeError("");
    console.log("Saving changes...");
    return true;
  };

  //Update account
  const updateAccount = async (e) => {
    e.preventDefault();
    const hasChange = handleUserChange();
    if (!hasChange) {
      return;
    }
    NameBlur();
    EmailBlur();
    PhoneBlur();
    if (
      !usernameError &&
      !emailError &&
      !phoneError &&
      username &&
      email &&
      phone
    ) {
      try {
        const response = await AccountService.updateInfo(account);
        console.log("Account updated", response);
        setFormSubmitted(true);
        setNoChangeError(false);
        setUpdateError(false);
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data?.message;
          if (errorMessage) {
            if (
              errorMessage.includes(
                "duplicate key value violates unique constraint"
              )
            ) {
              if (errorMessage.includes("phone")) {
                setPhoneError("Phone number already exists.");
              } else if (errorMessage.includes("email")) {
                setEmailError("Email already exists.");
              } else if (errorMessage.includes("username")) {
                setUserNameError("Username already exists.");
              }
            }
          } else {
            setUpdateError("An error occurred during update.");
            setFormSubmitted(false);
            setNoChangeError(false);
          }
        } else {
          console.error("Network or unknown error occurred:", error);
          setUpdateError("Network error occurred, please try again.");
        }
        setFormSubmitted(false);
      }
    } else {
      alert("Please fill in all fields correctly before submitting.");
    }
  };

  //Update pass
  const updatePass = async (e) => {
    e.preventDefault();
    OldPassBlur();
    PasswordBlur();
    RePasswordBlur();
    if (
      !oldPassError &&
      !passwordError &&
      !rePasswordError &&
      oldPass &&
      password &&
      rePassword &&
      !checkPass
    ) {
      try {
        await AccountService.updatePass(account);
        console.log("Updated info:", account);
        setFormSubmittedPass(true);
        setUpdateError(null);
        setOldPass("");
        setPassword("");
        setRePassword("");
        setTimeout(() => {
          navigate("/sign_in");
          setFormSubmittedPass(false);
        }, 1000);
      } catch (error) {
        // Handle errors
        if (error.response) {
          const { data } = error.response;
          if (data?.errors) {
            data.errors.forEach((err) => {
              if (err.fieldName === "oldPassword") {
                setOldPassError(err.message || "Invalid old password.");
              } else if (err.fieldName === "password") {
                setPasswordError(err.message || "Invalid new password.");
              }
            });
          } else if (data?.cause === "BadCredentialsException") {
            setOldPassError("Incorrect old password.");
          } else {
            setOldPassError("Invalid old password.");
          }
        } else {
          console.error("Network or unknown error occurred:", error);
          setUpdateError("Network error occurred, please try again.");
        }

        setFormSubmittedPass(false);
      }
    }
  };

  return (
    <div className="edit-profile-container col-12">
      <div className="edit-profile-header col-3 align-items-center">
      <img
          className="edit-profile-avatar"
          src={
            imgUser
              ? imgUser
              : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
          }
          alt="Avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
          }}
        />

        <div className="bg-img" value={imgUser}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-file"
            onChange={ImgChange}
          />
          <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
            <FaPen className="ic_pen" />
          </label>
        </div>
      </div>
      <div className="tabs mt-4">
        <button
          className={`tab-button-infor text-center ${
            activeTab === "profile" ? "active" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Edit Profile
        </button>

        <button
          className={`tab-button-infor text-center ${
            activeTab === "email" ? "active" : ""
          }`}
          onClick={() => setActiveTab("email")}
        >
          Edit Email
        </button>

        <button
          className={`tab-button-pass text-center ${
            activeTab === "password" ? "active" : ""
          }`}
          onClick={() => setActiveTab("password")}
        >
          Edit Password
        </button>
      </div>
      <div className="edit-profile-info-big col-8 mt-3">
        {activeTab === "profile" && (
          <div className="edit-profile-info">
            <div className="mt-3">
              {/* Input user name */}
              <div className="input-container">
                <p>
                  <strong>User name:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={NameChange}
                    onBlur={NameBlur}
                  />
                </div>
                {usernameError && (
                  <p style={{ color: "red" }}>{usernameError}</p>
                )}
              </div>



              {/* Input phone */}
              <div className="input-container">
                <p className="mt-3">
                  <strong>Phone:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={PhoneChange}
                    onBlur={PhoneBlur}
                  />
                </div>
                {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
              </div>

              {/* Input address */}
              <div className="input-container">
                <p className="mt-3">
                  <strong>Address:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={AddressChange}
                  />
                </div>
              </div>

              {/* Input bio */}
              <div className="input-container">
                <p className="mt-3">
                  <strong>Bio:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={DescriptionChange}
                  />
                </div>
              </div>
            </div>
            <div className="">
              {noChangeError && (
                <p className="mt-2" style={{ color: "red" }}>
                  {noChangeError}
                </p>
              )}
              {formSubmitted && (
                <p className="mt-2" style={{ color: "green" }}>
                  Update successful
                </p>
              )}
              {updateError && (
                <p className="mt-2" style={{ color: "red" }}>
                  {updateError}
                </p>
              )}

              <Link to="/profile">
                <button
                  className="bt-edit-profile mt-3"
                  onClick={updateAccount}
                >
                  Save
                </button>
              </Link>
              <p className="text-or text-center align-items-center justify-content-center">
                OR
              </p>
              <Link to="/profile">
                <button className="bt-cancel-profile">Back</button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "email" && (
          <div className="email-section">

              {/* Input email */}
              <div className="input-container">
                <p className="mt-3">
                  <strong>Email:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={EmailChange}
                    onBlur={EmailBlur}
                  />
                </div>
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}
              </div>

            


            
                <button
                  className="bt-edit-profile mt-3"
                  onClick={handleVisibleOTP}
                >
                  Update Email
                </button>
            
              <p className="text-or text-center align-items-center justify-content-center">
                OR
              </p>
              <Link to="/profile">
                <button className="bt-cancel-profile">Back</button>
              </Link>

              {/* OTP Pop-Up at the top of the page */}
              {otpVisible && (
                <div className="otp-popup-overlay">
                  <div className="otp-popup">
                    <h2>Enter OTP</h2>
                    <div className="form-group">
                      <label>OTP:</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter OTP"
                      />
                    </div>
                    <button  className="verify-otp" onClick={handleSubmitOtp} disabled={!otp}>
                      Verify OTP
                    </button>
                    <button  className="close-otp" onClick={handleCloseOtpPanel}>Close</button>
                  </div>
                </div>
              )}

          </div>
        )}

        {activeTab === "password" && (
          <div className="edit-profile-info">
            <div className="mt-3">
              {/* Input old password */}
              <div className="input-container">
                <p>
                  <strong>Old Password:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={oldPass}
                    onChange={OldPasswordChange}
                    onBlur={OldPassBlur}
                  />
                  <FontAwesomeIcon
                    className="icon-eye-password"
                    icon={showOldPassword ? faEyeSlash : faEye}
                    onClick={OldPasswordVisibility}
                  />
                </div>
                {oldPassError && <p style={{ color: "red" }}>{oldPassError}</p>}
              </div>

              {/* Input new password */}
              <div className="input-container">
                <p className="mt-3">
                  <strong>New Password:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={password}
                    onChange={PasswordChange}
                    onBlur={PasswordBlur}
                  />
                  <FontAwesomeIcon
                    className="icon-eye-password"
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={PasswordVisibility}
                  />
                </div>
                {!checkPass && passwordError && (
                  <p style={{ color: "red" }}>{passwordError}</p>
                )}
              </div>

              {/* Input confirm password */}
              <div className="input-container">
                <p className="mt-3">
                  <strong>Confirm New Password:</strong>
                </p>
                <div className="input-wrapper">
                  <input
                    type={showRePassword ? "text" : "password"}
                    name="confirmPassword"
                    value={rePassword}
                    onChange={ConfirmPasswordChange}
                    onBlur={RePasswordBlur}
                  />
                  <FontAwesomeIcon
                    className="icon-eye-password"
                    icon={showRePassword ? faEyeSlash : faEye}
                    onClick={RePasswordVisibility}
                  />
                </div>
                {rePasswordError && !checkPass && (
                  <p style={{ color: "red" }}>{rePasswordError}</p>
                )}
              </div>
            </div>
            {formSubmittedPass && (
              <p className="mt-2" style={{ color: "green" }}>
                Update successful
              </p>
            )}
            {updateError && (
              <p className="mt-2" style={{ color: "red" }}>
                {updateError}
              </p>
            )}
            <Link to="/profile">
              <button className="bt-edit-profile mt-3" onClick={updatePass}>
                Save
              </button>
            </Link>
            <p className="text-or text-center align-items-center justify-content-center">
              OR
            </p>
            <Link to="/profile">
              <button className="bt-cancel-profile">Back</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
