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
import { Order } from "./page/order/Order";
import { FoodItem } from "./components/food_item/FoodItem";
import { FoodDisplay } from "./components/food_display/FoodDisplay";
import Register from "./components/register/Register";
import SignIn from "./components/sign_in/SignIn";
import Invoice from "./page/invoice/Invoice";
import OrderConfirmation from "./page/order_confirm/OrderConfirmation";
import Google from "./page/google/Google";
import OrderDetail from "./page/order_detail/OrderDetail";
import { CartProvider } from "./components/context/Context";
import Blog from "./page/blog/Blog";
import BlogDetail from "./page/blog_detail/BlogDetail";
import ForgotPassword from "./components/forget/ForgetPass";  


const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
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

  const openForgotPass = () => {
    setShowLogin(false);
    setShowForgotPass(true);
  };

  const blogData = {
    "blog": {
      "id": "B01",
      "title": "Pepperoni PIZZA 🍕 ",
      "description": "Pepperoni PIZZA 🍕 ",
      "markdownText": "# The Delicious World of Pepperoni Pizza\n\nPepperoni pizza is...",
      "infos": {
        "SERVING": "4",
        "COOK_TIME": "20-25 min"
      },
      "tags": ["pizza", "pepperonie"],
      "relatedProduct": ["MK01"],
      "imageUrl": "https://th.bing.com/th/id/OIP.5ss0Np4_jqHlZAkJsGsrTQHaFj?rs=1&pid=ImgDetMain"
    },
    "bookmark": false
  };

  return (
    <>
      <div className="app">
        <CartProvider>
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
            <Route path="order" element={<Order />} />
            <Route path="food_item" element={<FoodItem />} />
            <Route path="edit_profile" element={<EditProfile />} />
            <Route path="sign_in" element={<SignIn />} />
            <Route path="register" element={<Register />} />
            <Route path="token" element={<Google />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="order_confirm/:id" element={<OrderConfirmation />} />
            <Route path="order_detail/:id" element={<OrderDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog_detail/:id" element={<BlogDetail blogData={blogData} />} />
          </Routes>
          {showLogin && (
            <Login
              setShowLogin={setShowLogin}
              openSignUp={openSignUp}
              onLoginSuccess={handleLoginSuccess}
              openForgotPass={openForgotPass}
            />
          )}
          {showSignUp && (
            <Sign_up setShowSignUp={setShowSignUp} openLogin={openLogin} />
          )}

          {showForgotPass && (
            <ForgotPassword setShowForgotPass={setShowForgotPass} />
          )}

        </CartProvider>
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
