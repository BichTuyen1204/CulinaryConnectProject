import React, { useState, useEffect } from "react";
import ExploreMenu from "../../components/menu/ExploreMenu";
import { FoodDisplay } from "../../components/food_display/FoodDisplay";
import ProductService from "../../api/ProductService";

const MenuPage = () => {
  const [category, setCategory] = useState("All"); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;

        switch (category) {
          case "All":
            response = await ProductService.getAllProduct();
            break;
          case "Meal Kit":
            response = await ProductService.getProductsByCategory("MEALKIT");
            break;
          case "Vegetable":
            response = await ProductService.getProductsByCategory("VEGETABLE");
            break; 
          case "Meat":
            response = await ProductService.getProductsByCategory("MEAT");
            break; 
          case "Season":
            response = await ProductService.getProductsByCategory("SEASON");
            break; 
          default:
            console.warn("Unknown category:", category);
            response = [];
            break;
        }
        setProducts(response); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay products={products} />
    </div>
  );
};

export default MenuPage;
