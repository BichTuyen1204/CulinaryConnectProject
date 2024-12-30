import React from "react";
import "./FoodDisplay.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FoodItem } from "../food_item/FoodItem";

export const FoodDisplay = ({ products }) => {
  return (
    <div className="food-display" id="food-display">
      <h2>Top food near you</h2>
      <div className="food-display-list ">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="" key={index}>
              <FoodItem product={product} />
            </div>
          ))
        ) : (
          <div className="">
            <p className="text-center">
              No products available for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
