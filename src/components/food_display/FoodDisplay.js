import React from "react";
import "./FoodDisplay.css";
import FoodItem from "../food_item/FoodItem";
import Chicken from "../../assets/Chicken.png";
import Fish from "../../assets/ca_dieu_hong.png";
import Shrimp from "../../assets/shrimp.png";
import Beef from "../../assets/Beef.png";
import "bootstrap/dist/css/bootstrap.min.css";

const products = [
  {
    name: "Chicken Chicken Chicken Chicken Chicken Chicken Chicken",
    price: "20.000đ",
    quantity: 54,
    image: Chicken,
  },
  { name: "Fish", price: "15.000đ", quantity: 32, image: Fish },
  { name: "Shrimp", price: "15.000đ", quantity: 32, image: Shrimp },
  { name: "Beef", price: "15.000đ", quantity: 32, image: Beef },
  { name: "Fish", price: "15.000đ", quantity: 32, image: Fish },
  { name: "Fish", price: "15.000đ", quantity: 32, image: Fish },
  { name: "Fish", price: "15.000đ", quantity: 32, image: Fish },
];

const FoodDisplay = () => {
  return (
    <div className="food-display" id="food-display">
      <h2>Top food near you </h2>
      <div className="food-display-list col-12">
        {products.map((product, index) => (
          <div className="col-12">
            <FoodItem key={index} product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default FoodDisplay;
