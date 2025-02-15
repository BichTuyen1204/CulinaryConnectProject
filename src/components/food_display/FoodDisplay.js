import React from "react";
import "./FoodDisplay.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FoodItem } from "../food_item/FoodItem";

export const FoodDisplay = ({ products }) => {
  return (
    <div className="food-display" id="food-display">
      <h2>Top food near you</h2>
      <div>
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="food-display-list" key={index}>
              <div>
                <FoodItem product={product} />
              </div>
            </div>
          ))
        ) : (
          <div style={{ marginTop: "35px" }}>
            <p className="text-center">
              No products available for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
