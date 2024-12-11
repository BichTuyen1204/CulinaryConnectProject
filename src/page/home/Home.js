import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../home/Home.css';
import Header from "../../components/header/Header";
import ExploreMenu from "../../components/menu/ExploreMenu";
import { FoodDisplay } from "../../components/food_display/FoodDisplay";

export const Home = () => {
    const [category, setCategory] = useState("All");

    // useEffect(() => {
    //     const queryParams = new URLSearchParams(window.location.search);
    //     const token = queryParams.get("token");

    //     if (token) {
    //         sessionStorage.setItem("jwtToken", token);
    //         console.log("Token saved: ", token);
    //         window.history.replaceState(null, null, window.location.pathname);
    //         navigate("/", { replace: true });
    //     } else {
    //         const savedToken = sessionStorage.getItem("jwtToken");
    //         if (!savedToken) {
    //             console.error("Token not exist");
    //             // navigate("/sign_in");
    //         }
    //     }

    //     window.scrollTo(0, 0);
    // }, [navigate]);

    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay />
        </div>
    );
};
