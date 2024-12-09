import React, { useEffect, useState } from "react";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountService from "../../api/AccountService";
import { Link } from "react-router-dom";

export const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imgUser, setImgUser] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== null) {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setEmail(response.email);
          setPhone(response.phone);
          setAddress(response.address);
          setDescription(response.profileDescription);
          setImgUser(response.profilePictureUri);
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

  return (
    <div className="profile-container d-flex col-12">
      <div className="profile-header col-3 row align-items-center justify-content-center">
        <img
          className="profile-avatar col-12 border-orange"
          src={imgUser}
          alt="Avatar"
        />
        <h1 className="profile-name col-12 text-center">{}</h1>
      </div>

      <div className="col-center col-1"></div>

      <div className="profile-info col-8 mt-5">
        <h2 className="">Profile Information</h2>
        <div className="mt-3">
          <p>
            <strong>User name:</strong> {username}
          </p>
          <p className="mt-3">
            <strong>Email:</strong> {email}
          </p>
          <p className="mt-3">
            <strong>Phone:</strong> {phone}
          </p>
          <p className="mt-3">
            <strong>Address:</strong> {address}
          </p>
          <p className="mt-3">
            <strong>Bio:</strong> {description}
          </p>
        </div>
        <Link to="/edit_profile">
        <button className="bt-edit-profile mt-3">Edit Your Profile</button>
        </Link>
      </div>
    </div>
  );
};
