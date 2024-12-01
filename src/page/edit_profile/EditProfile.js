import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import { Link } from "react-router-dom";
import AccountService from "../../api/AccountService";

export const EditProfile = () => {
  const [username, setUserName] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [activeTab, setActiveTab] = useState("profile");

  const [account, setAccount] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  const user = {
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
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

  //Call infor
  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setAccount(response);
          setUserName(response.username);
          setEmail(response.email);
          setPhone(response.phone);
          setAddress(response.address);
          setDescription(response.profileDescription);
        } catch (error) {
          console.error("Error fetching account information:", error);
        }
      } else {
        setUserName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setDescription("");
      }
    };
    getAccount();
  }, [jwtToken]);

  //Update account
  const updateAccount = async (e) => {
    e.preventDefault();
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
        if (response.success) {
          const newJwtToken = response.accessToken;
          sessionStorage.setItem("jwtToken", newJwtToken);
        }
        console.log("Account updated", response);
        setFormSubmitted(true);
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

  return (
    <div className="edit-profile-container col-12">
      <div className="edit-profile-header col-3 align-items-center">
        <img
          className="edit-profile-avatar"
          src={user.avatarUrl}
          alt="Avatar"
        />
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
              <div>
                <p>
                  <strong>User name:</strong>
                </p>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={NameChange}
                  onBlur={NameBlur}
                />
                {usernameError && (
                  <p style={{ color: "red" }}>{usernameError}</p>
                )}
              </div>
              <div>
                <p className="mt-3">
                  <strong>Email:</strong>
                </p>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={EmailChange}
                  onBlur={EmailBlur}
                />
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}
              </div>

              <div>
                <p className="mt-3">
                  <strong>Phone:</strong>
                </p>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={PhoneChange}
                  onBlur={PhoneBlur}
                />
                {phoneError && <p style={{ color: "red" }}>{phoneError}</p>}
              </div>

              <div>
                <p className="mt-3">
                  <strong>Address:</strong>
                </p>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={AddressChange}
                />
              </div>

              <div>
                <p className="mt-3">
                  <strong>Bio:</strong>
                </p>
                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={DescriptionChange}
                />
              </div>
            </div>
            <div className="">
              {formSubmitted && (
                <p style={{ color: "green" }}>Update successful</p>
              )}
              <Link to="/profile">
                <button
                  className="bt-edit-profile mt-5"
                  onClick={updateAccount}
                >
                  Save
                </button>
              </Link>
              <p className="text-or text-center align-items-center justify-content-center">
                OR
              </p>
              <Link to="/profile">
                <button className="bt-cancel-profile">Cancel</button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "password" && (
          <div className="edit-profile-info">
            <div className="mt-3">
              <div>
                <p>
                  <strong>Old Password:</strong>
                </p>
                <input type="password" name="oldPassword" />
              </div>
              <div>
                <p className="mt-3">
                  <strong>New Password:</strong>
                </p>
                <input type="password" name="newPassword" />
              </div>

              <div>
                <p className="mt-3">
                  <strong>Confirm New Password:</strong>
                </p>
                <input type="password" name="confirmPassword" />
              </div>
            </div>
            <Link to="/profile">
              <button className="bt-edit-profile mt-5">Save</button>
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
