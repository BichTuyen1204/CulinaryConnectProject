import React from "react";
import "../home/Home.css";
import Header from "../../components/header/Header";
import MenuPage from "../../components/parent/FoodDisplayAndCategory";

export const Home = () => {
  window.scrollTo(0, 0);
  return (
    <div>
      <Header />
      <MenuPage />
    </div>
  );
};
