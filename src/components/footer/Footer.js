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
            <img src={Logo} alt="Culinary Connect Logo" />
          </Link>
        </div>
        <div className="footer-content-left">
          <h2>
            <strong>Access to us</strong>
          </h2>
          <ul className="ul-icon-social">
            <li>
              <FaFacebookSquare className="facebook" />
            </li>
            <li>
              <AiFillTikTok className="tiktok" />
            </li>
            <li>
              <IoLogoYoutube className="youtube" />
            </li>
          </ul>
        </div>

        <div className="footer-content-center">
          <h2>
            <strong>Culinary Connect</strong>
          </h2>
          <ul>
            <Link to="/">
              <li className="li-home d-flex">
                <IoHome style={{ marginRight: "10px" }} />
                <p>Home</p>
              </li>
            </Link>

            <li className="li-aboutus d-flex">
              <FaUserTie style={{ marginRight: "10px" }} />
              <p>About us</p>
            </li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>
            <strong>Contact</strong>
          </h2>
          <ul className="address-links">
            <li className="address1 d-flex">
              <FaBuilding className="address" />
              <p>14 Nguyen Van Cu, An Khanh, Ninh Kieu, Can Tho</p>
            </li>
            <li className="address1 d-flex">
              <SlEarphonesAlt className="address" />
              <p>0999 999 999</p>
            </li>
            <li className="address1 d-flex">
              <IoMail className="address" />
              <p>CulinaryConnect@gmail.com</p>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright by Culinary Connect</p>
    </div>
  );
};

export default Footer;