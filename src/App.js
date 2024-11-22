import React, { useState } from "react";
import { Navbar } from "./components/navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./page/home/Home";
import ExploreMenu from "./components/menu/ExploreMenu";
import Footer from "./components/footer/Footer";
import Login from "./components/login/Login";
import Sign_up from "./components/sign_up/Sign_up";
import Cart from "./page/cart/Cart";
import Contact from "./page/contact/Contact";
import { Food_card } from "./page/food_card/Food_card";
import { Food_detail } from "./page/food_detail/Food_detail";
import Breadcrumb from "./components/bread_crumb/Breadcrumb";
import Recipe from "./page/recipe/Recipe";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const openSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };
  return (
    <>
      {showLogin && (
        <Login setShowLogin={setShowLogin} openSignUp={openSignUp} />
      )}
      {showSignUp && (<Sign_up setShowSignUp={setShowSignUp} openLogin={openLogin} />)}
      <BrowserRouter>
        <div className="app">
          <Navbar setShowLogin={setShowLogin} />

          {/* Thêm Breadcrumb ở đây */}
          <Breadcrumb />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="exploreMenu" element={<ExploreMenu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="contact" element={<Contact />} />
            <Route path="food_card" element={<Food_card />} />
            <Route path="food_detail" element={<Food_detail />} />
            <Route path="recipe" element={<Recipe />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
