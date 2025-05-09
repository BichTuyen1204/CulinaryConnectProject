import React from "react";
import { menu_list } from "../../assets/Assets";
import "../menu/ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu bg-white px-5 py-3" id="explore-menu">
      <h4>Explore our menu</h4>
      <p className="explore-menu-text">Let's explore fresh products with us</p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img className="img-detail" src={item.menu_img} alt="" />
              <p className={category === item.menu_name ? "active" : ""}>
                {item.menu_name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMenu;
