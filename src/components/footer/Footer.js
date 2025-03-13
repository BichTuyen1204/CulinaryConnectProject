import React from "react";
import Logo from "../../assets/logo_new.jpg";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";
import { SlEarphonesAlt } from "react-icons/sl";
import { IoMail } from "react-icons/io5";
import "../footer/Footer.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoHome } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="img-logo-footer">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="footer-content-left">
          <h2>
            <strong>Access to us</strong>
          </h2>
          <div className="ul-icon-social">
            <li>
              <FaFacebookSquare className="facebook" />
            </li>
            <li>
              <AiFillTikTok className="tiktok" />
            </li>
            <li>
              <IoLogoYoutube className="youtube" />
            </li>
          </div>
        </div>

        <div className="footer-content-center">
          <h2>
            <strong>Culinary Connect</strong>
          </h2>
          <ul>
            <Link to="/">
              <li className="li-home d-flex">
                <IoHome style={{ marginRight: "15px" }} />
                <p style={{ fontSize: "0.8em" }}>Home</p>
              </li>
            </Link>

            <li className="li-aboutus d-flex">
              <FaUserTie style={{ marginRight: "15px" }} />
              <p style={{ fontSize: "0.8em" }}>About us</p>
            </li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>
            <strong>Contact</strong>
          </h2>
          <div className="address-links">
            <li className="address1 d-flex">
              <FaBuilding className="address" />
              <p style={{ fontSize: "0.8em" }}>
                14 Nguyen Van Cu, An Khanh, Ninh Kieu, Can Tho
              </p>
            </li>
            <li className="address1 d-flex">
              <SlEarphonesAlt className="address" />
              <p style={{ fontSize: "0.8em" }}>0999 999 999</p>
            </li>
            <li className="address1 d-flex">
              <IoMail className="address" />
              <p style={{ fontSize: "0.8em" }}>CulinaryConnect@gmail.com</p>
            </li>
          </div>
        </div>
      </div>
      <hr />
      <p className="footer-coppyright">Copyright by Culinary Connect</p>
    </div>
  );
};
export default Footer;
