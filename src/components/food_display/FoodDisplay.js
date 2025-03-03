import React from "react";
import "./FoodDisplay.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FoodItem } from "../food_item/FoodItem";

export const FoodDisplay = ({ products }) => {
  return (
    <div className="food-display bg-white px-5 py-4" id="food-display">
      {products.length > 0 ? (
        <>
          <h4>Top food near you</h4>
          <div className="food-display-list">
            {products.map((product, index) => (
              <div key={index}>
                <FoodItem product={product} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: "35px" }}>
          <p className="text-center">
            No products available for this category.
          </p>
        </div>
      )}
    </div>
  );
};
