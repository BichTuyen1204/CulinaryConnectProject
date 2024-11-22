import React from "react";
import "../header/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Oder your food to easy here</h2>
        <p>Like it</p>
        <Link to="/food_card">
        <button>View Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
