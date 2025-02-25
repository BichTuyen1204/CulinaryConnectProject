import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../home/Home.css";
import Header from "../../components/header/Header";
import ExploreMenu from "../../components/menu/ExploreMenu";
import { FoodDisplay } from "../../components/food_display/FoodDisplay";
import MenuPage from "../../components/parent/FoodDisplayAndCategory";
import CustomerChat from "../../components/CustomerChat";

export const Home = () => {
  const [category, setCategory] = useState("All");
  window.scrollTo(0, 0);
  return (
    <div>
      <Header />
      <MenuPage />
    </div>
  );
};
