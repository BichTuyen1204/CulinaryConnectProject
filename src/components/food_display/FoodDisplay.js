import React from "react";
import "./FoodDisplay.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FoodItem } from "../food_item/FoodItem";

export const FoodDisplay = ({ products }) => {
  return (
    <div className="food-display" id="food-display">
      <h2>Top food near you</h2>
      <div className="food-display-list col-12">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="col-12" key={index}>
              <FoodItem product={product} />
            </div>
          ))
        ) : (
          <p>No products available for this category.</p>
        )}
      </div>
    </div>
  );
};
