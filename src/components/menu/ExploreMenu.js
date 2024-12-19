import React, { useEffect, useState } from "react";
import "../menu/ExploreMenu.css";
import ProductService from "../../api/ProductService";

// Images for product categories
import menu_mealkit from '../../assets/meals_icon.png';
import menu_meat from '../../assets/meat_icon.png';
import menu_seasoning from '../../assets/seasoning_icon.png';
import menu_vegetable from '../../assets/vegetable_icon.png';

const ExploreMenu = ({ category, setCategory }) => {
  const [menuList, setMenuList] = useState([]);

  // Map product type to a formatted name
  const getFormattedName = (productType) => {
    switch (productType?.toUpperCase()) {
      case "MEALKIT":
        return "Meal Kit";
      case "MEAT":
        return "Meat";
      case "VEGETABLE":
        return "Vegetable";
      case "SEASON":
        return "Seasoning";
      default:
        return productType; // Return the original name if no match
    }
  };

  // Map product type to image
  const getImageForProductType = (productType) => {
    switch (productType?.toUpperCase()) {
      case "VEGETABLE":
        return menu_vegetable;
      case "MEAT":
        return menu_meat;
      case "MEALKIT":
        return menu_mealkit;
      case "SEASON":
        return menu_seasoning;
      default:
        return ""; // Default or fallback image
    }
  };

  // Fetch product categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductService.getAllProductCategory();
        console.log("API Response:", response);
        const productData = response || []; // Ensure we get an array
        console.log("Parsed Product Data:", productData);
        const formattedMenu = productData.map((productType) => ({
          menu_name: getFormattedName(productType),
          menu_img: getImageForProductType(productType),
        }));
        console.log("Formatted Menu Data:", formattedMenu);
        setMenuList(formattedMenu);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">Let's explore fresh products with us</p>

      <div className="explore-menu-list">
        {menuList.length > 0 ? (
          menuList.map((item, index) => (
            <div
              key={index}
              className="explore-menu-list-item"
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
            >
              <img
                className="img-detail"
                src={item.menu_img || "fallback_image_path_here.png"}
                alt={item.menu_name}
              />
              <p className={category === item.menu_name ? "active" : ""}>
                {item.menu_name || "Unnamed"}
              </p>
            </div>
          ))
        ) : (
          <p>Loading menu...</p>
        )}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
