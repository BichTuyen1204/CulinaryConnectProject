import React, { useEffect, useState } from "react";
import "./FoodDisplay.css";
import FoodItem from "../food_item/FoodItem";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";

const FoodDisplay = () => {
  const [products, setProducts] = useState([]);
  const showProduct = async () => {
    try {
      const response = await ProductService.getAllProduct();
      if (response){
        setProducts(response);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }

  useEffect(() => {
    showProduct();
  }, []);
  return (
    <div className="food-display" id="food-display">
      <h2>Top food near you </h2>
      <div className="food-display-list col-12">
        {products.map((product, index) => (
          <div className="col-12" key={index}>
            <FoodItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default FoodDisplay;
