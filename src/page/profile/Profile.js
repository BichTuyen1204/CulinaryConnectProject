import React, { useEffect, useState } from "react";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountService from "../../api/AccountService";
import { Link, useNavigate } from "react-router-dom";

export const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imgUser, setImgUser] = useState("");
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
      return;
    } else {
      const getAccount = async () => {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setEmail(response.email);
          setPhone(response.phone);
          setAddress(response.address);
          setDescription(response.profileDescription);
          setImgUser(response.profilePictureUri);
        } catch (error) {
          sessionStorage.removeItem("jwtToken");
          navigate("/sign_in");
        }
      };
      getAccount();
    }
  }, [jwtToken, navigate]);
  return (
    <div className="profile-container d-flex col-12">
      <div className="profile-header col-3 row align-items-center justify-content-center">
        <img
          className="profile-avatar col-12 border-orange"
          src={
            imgUser && imgUser.trim() !== ""
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
      </div>

      <div className="profile-info col-8 mt-2 mx-4">
        <h2>Profile Information</h2>
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
