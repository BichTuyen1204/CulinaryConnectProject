import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import { Link, useNavigate } from "react-router-dom";
import AccountService from "../../api/AccountService";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoCamera } from "react-icons/io5";

export const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [profileName, setProfileName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [profileNameError, setProfileNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [DescriptionError, setDescriptionError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
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
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultAvatar =
    "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";

  const [account, setAccount] = useState({
    email: "",
    profilePictureUri: "",
    url: "",
  });

  const [updateInfo, setUpdateInfo] = useState({
    username: "",
    phone: "",
    profileName: "",
    address: "",
    description: "",
  });

  const [updatePassword, setUpdatePassword] = useState({
    oldPassword: "",
    password: "",
  });

  const [originalInfo, setOriginalInfo] = useState(null);

  const [firstAvatar, setFirstAvatar] = useState({
    profilePictureUri: defaultAvatar,
  });

  const ImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImgUser(previewUrl);
    setAccount((preState) => ({
      ...preState,
      profilePictureUri: previewUrl,
    }));

    // setImgUser(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await AccountService.updateImage(formData);
      if (response && response.url) {
        setImgUser(response.url);
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
      alert("Failed to update image.");
    }
  };

  const UserNameChange = (e) => {
    let { value } = e.target;
    value = value.replace(/[^a-zA-Z0-9]/g, "");
    setUsername(value);
    setUpdateInfo((preState) => ({ ...preState, username: value }));
    setFormSubmitted(false);
    setUserNameError("");
    setNoChangeError("");
  };

  const PhoneChange = (e) => {
    const { value } = e.target;
    setPhone(value);
    setUpdateInfo((preState) => ({ ...preState, phone: value }));
    setFormSubmitted(false);
    setPhoneError("");
    setNoChangeError("");
  };

  const ProfileNameChange = (e) => {
    let { value } = e.target;
    value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    setProfileName(value);
    setUpdateInfo((preState) => ({ ...preState, profileName: value }));
    setFormSubmitted(false);
    setProfileNameError("");
    setNoChangeError("");
  };

  const AddressChange = (e) => {
    const { value } = e.target;
    setAddress(value);
    setUpdateInfo((preState) => ({ ...preState, address: value }));
    setFormSubmitted(false);
    setAddressError("");
    setNoChangeError("");
  };

  const DescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    setUpdateInfo((preState) => ({ ...preState, description: value }));
    setFormSubmitted(false);
    setDescriptionError("");
    setNoChangeError("");
  };

  // Check full name
  const NameBlur = () => {
    if (updateInfo.username.trim() === "") {
      setUserNameError("Please enter your full name");
    } else if (updateInfo.username.length < 4) {
      setUserNameError("The full name must be at least 4 characters");
    } else if (updateInfo.username.length > 100) {
      setUserNameError("The full name must be less than 100 characters");
    } else {
      setUserNameError("");
    }
  };

  const ProfileNameBlur = () => {
    if (updateInfo.profileName.trim() === "") {
      setProfileNameError("Please enter your profile name");
    } else if (updateInfo.profileName.length < 3) {
      setProfileNameError("The profile name must be at least 3 characters");
    } else if (updateInfo.profileName.length > 100) {
      setProfileNameError("The profile name must be less than 100 characters");
    } else {
      setProfileNameError("");
    }
  };

  // Receives email
  const EmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    setAccount((preState) => ({ ...preState, email: value }));
    setEmailError("");
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

  const [accountId, setAccountId] = useState(null);
  const handleVisibleOTP = async () => {
    EmailBlur();
    if (!emailError && email) {
      try {
        setLoading(true);
        const response = await AccountService.updateEmailOTP(email);

        if (response) {
          setAccountId(response.accountId);
          setOtpVisible(true);
        }
      } catch (error) {
        setEmailError("Please enter your email");
      } finally {
        setLoading(false);
      }
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
      setOtpVisible(false);
      if (response) {
        alert("Email successfully updated!");
      }
    } catch (error) {
      alert("Sorry, you cannot use this email to perform the update.");
    }
  };

  const handleCloseOtpPanel = () => {
    setOtpVisible(false);
  };

  // Check phone number
  const PhoneBlur = () => {
    if (updateInfo.phone.trim() === "") {
      setPhoneError("Please enter your phone number");
    } else if (updateInfo.phone.length < 10 || updateInfo.phone.length > 10) {
      setPhoneError("Your phone number must be 10 digits");
    } else if (!/^\d+$/.test(updateInfo.phone)) {
      setPhoneError("Your phone number just only number");
    } else if (!/^0/.test(updateInfo.phone)) {
      setPhoneError("Phone number must start with 0");
    } else {
      setPhoneError("");
    }
  };

  // Receive old password
  const OldPasswordChange = (e) => {
    const { value } = e.target;
    setOldPass(value);
    setUpdatePassword((preState) => ({ ...preState, oldPassword: value }));
    setOldPassError("");
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
    setUpdatePassword((preState) => ({ ...preState, password: value }));
    setOldPassError("");
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
    setRePasswordError("");
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

  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
      return;
    }
    const getAccount = async () => {
      try {
        const response = await AccountService.account(jwtToken);
        setUsername(response.username);
        setPhone(response.phone);
        setProfileName(response.profileName);
        setAddress(response.address);
        setDescription(response.profileDescription);
        setImg(response.profilePictureUri);

        setUpdateInfo({
          username: response.username || "",
          phone: response.phone || "",
          profileName: response.profileName || "",
          address: response.address || "",
          description: response.profileDescription || "",
        });
        setOriginalInfo({
          username: response.username || "",
          phone: response.phone || "",
          profileName: response.profileName || "",
          address: response.address || "",
          description: response.profileDescription || "",
        });
      } catch (error) {}
    };

    getAccount();
  }, [jwtToken, navigate]);

  //Update account
  const updateAccount = async (e) => {
    e.preventDefault();
    NameBlur();
    PhoneBlur();
    if (usernameError || phoneError) {
      return;
    }
    const isChanged =
      JSON.stringify(updateInfo) !== JSON.stringify(originalInfo);

    if (!isChanged) {
      setNoChangeError(
        "Please change at least one piece of information before saving."
      );
      return;
    }
    try {
      console.log("updateInfo gửi đi:", updateInfo);
      await AccountService.updateInfo(updateInfo);
      setOriginalInfo(updateInfo);
      setFormSubmitted(true);
      setNoChangeError(null);
      setUpdateError(null);
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
            } else if (errorMessage.includes("username")) {
              setUserNameError("Username already exists.");
            }
          }
        } else {
          setUpdateError("An error occurred during update.");
        }
      } else {
        setUpdateError("Network error occurred, please try again.");
      }
      setFormSubmitted(false);
    }
  };

  //Update pass
  const updatePass = async (e) => {
    e.preventDefault();
    OldPassBlur();
    PasswordBlur();
    RePasswordBlur();
    if (
      oldPassError ||
      passwordError ||
      rePasswordError ||
      !oldPass.trim() ||
      !password.trim() ||
      !rePassword.trim() ||
      checkPass
    ) {
      return;
    }
    const updatedPasswordData = {
      oldPassword: oldPass,
      password: password,
    };
    try {
      await AccountService.updatePass(updatedPasswordData);
      setFormSubmittedPass(true);
      setUpdateError(null);
      setOldPass("");
      setPassword("");
      setRePassword("");

      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/sign_in");
        window.location.reload();
        setFormSubmittedPass(false);
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data?.messages;
        if (errorMessage === "Old password does not match") {
          setOldPassError("Old password is incorrect.");
        }
      } else {
        setUpdateError("Network error occurred, please try again.");
      }
      setFormSubmittedPass(false);
    }
  };

  return (
    <div className="edit-profile-container col-12">
      <div className="edit-profile-header col-3 align-items-center">
        <img
          className="edit-profile-avatar"
          src={img || defaultAvatar}
          alt="Avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
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
            <IoCamera className="ic_pen" />
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
                  <span>
                    <strong>Username</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
                </p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={UserNameChange}
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
                  <span>
                    <strong>Phone</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
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

              {/* Input profile name */}
              <div className="input-container">
                <p>
                  <span>
                    <strong>Profile name</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
                </p>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="profilename"
                    value={profileName}
                    onChange={ProfileNameChange}
                    onBlur={ProfileNameBlur}
                  />
                </div>
                {profileNameError && (
                  <p style={{ color: "red" }}>{profileNameError}</p>
                )}
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

              <button className="bt-edit-profile mt-3" onClick={updateAccount}>
                Save
              </button>
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
                <span>
                  <strong>Email</strong> <span style={{ color: "red" }}>*</span>
                </span>
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

            <div style={{ marginBottom: "-10px" }}>
              {loading && (
                <p
                  style={{
                    color: "green",
                    fontStyle: "italic",
                    marginTop: "10px",
                    fontSize: "0.9em",
                  }}
                >
                  Please wait...
                </p>
              )}
            </div>

            <button className="bt-edit-profile mt-3" onClick={handleVisibleOTP}>
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
                  <h3>Enter OTP</h3>
                  <div className="form-group">
                    <label>OTP:{" "}</label>
                    <input
                    style={{
                      fontSize: "0.8em"
                    }}
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter OTP"
                    />
                  </div>
                  <button
                    className="verify-otp"
                    onClick={handleSubmitOtp}
                    disabled={!otp}
                  >
                    Verify OTP
                  </button>
                  <button className="close-otp" onClick={handleCloseOtpPanel}>
                    Close
                  </button>
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
                  <span>
                    <strong>Old Password</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
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
                  <span>
                    <strong>New Password</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
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
                  <span>
                    <strong>Confirm New Password</strong>{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
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
            <button className="bt-edit-profile mt-3" onClick={updatePass}>
              Save
            </button>
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
