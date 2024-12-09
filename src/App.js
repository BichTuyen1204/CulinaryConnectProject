import React, { useState } from "react";
import { Navbar } from "./components/navbar/Navbar";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
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
import { Profile } from "./page/profile/Profile";
import { EditProfile } from "./page/edit_profile/EditProfile";
import FoodDisplay from "./components/food_display/FoodDisplay";
import FoodItem from "./components/food_item/FoodItem";

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate("/");
  };

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
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Breadcrumb />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="exploreMenu" element={<ExploreMenu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="contact" element={<Contact />} />
          <Route path="food_card" element={<Food_card />} />
          <Route path="food_detail/:id" element={<Food_detail />} />
          <Route path="food_detail" element={<Food_detail />} />
          <Route path="food_display" element={<FoodDisplay />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="food_item"
            element={<FoodItem openLogin={openLogin} />}
          />
          <Route
            path="edit_profile"
            element={<EditProfile openLogin={openLogin} />}
          />
        </Routes>
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            openSignUp={openSignUp}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {showSignUp && (
          <Sign_up setShowSignUp={setShowSignUp} openLogin={openLogin} />
        )}
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
