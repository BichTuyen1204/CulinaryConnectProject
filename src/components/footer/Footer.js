import React from "react";
import Logo from "../../assets/logo.png";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";
import { SlEarphonesAlt } from "react-icons/sl";
import { IoMail } from "react-icons/io5";
import "../footer/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="img-logo-footer">
        <Link to="/"><img src={Logo} alt="" /></Link>
        </div>
        <div className="footer-content-left">
            <h2>Access to us</h2>
            <ul>
              <li>
                <FaFacebookSquare className="facebook" />
                <AiFillTikTok className="tiktok" />
                <IoLogoYoutube className="youtube" />
              </li>
            </ul>
        </div>

        <div className="footer-content-center">
          <h2>Culinary Connect</h2>
          <ul>
            <li className="li-home">Home</li>
            <li className="li-aboutus">About us</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>
            <strong>Contact</strong>
          </h2>
          <div class="address-links">
            <li class="address1">
              <FaBuilding className="address" />
              14 Nguyen Van Cu, An Khanh, Ninh Kieu, Can Tho
            </li>
            <li className="address1">
              <SlEarphonesAlt className="address" />
              0999 999 999
            </li>
            <li className="address1">
              <IoMail className="address" />
              CulinaryConnect@gmail.com
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
