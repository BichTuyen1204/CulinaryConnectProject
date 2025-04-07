import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountService from "../../api/AccountService";
import "../google/Google.css";

const Google = () => {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setError("");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenValue = urlParams.get("value");
    setToken(tokenValue);
    if (tokenValue) {
      sessionStorage.setItem("jwtToken", tokenValue);
    }
  }, []);

  useEffect(() => {
    if (jwtToken) {
      const getAccount = async () => {
        try {
          const response = await AccountService.account(jwtToken);
          setEmail(response.email);
        } catch (error) {
          sessionStorage.removeItem("jwtToken");
          navigate("/sign_in");
        }
      };
      getAccount();
    }
  }, [jwtToken, navigate]);

  const handleYesClick = () => {
    if (!isChecked) {
      setError("Please check the checkbox before proceeding.");
    } else {
      navigate("/");
      window.location.reload();
    }
  };

  const handleNoClick = () => {
    if (!isChecked) {
      setError("Please check the checkbox before proceeding.");
    } else {
      sessionStorage.removeItem("jwtToken");
      navigate("/sign_in");
    }
  };

  return (
    <div>
      {token ? (
        <div className="confirmation-container">
          <div className="confirmation-box">
            <h3 className="mb-3">
              Are you sure you want to select this email?
            </h3>
            <div className="info-google d-flex text-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="checkbox"
              />
              <h2>{email}</h2>
            </div>
            {error && (
              <p className="error-message mb-4" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <div className="confirmation-buttons">
              <button className="yes-button" onClick={handleYesClick}>
                Yes
              </button>
              <button className="no-button" onClick={handleNoClick}>
                No
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-center">
          Could not find the email you registered with.
        </p>
      )}
    </div>
  );
};

export default Google;
