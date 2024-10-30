import React, { useState } from "react";
import '../home/Home.css';
import Header from "../../components/header/Header";
import ExploreMenu from "../../components/menu/ExploreMenu";
import FoodDisplay from "../../components/food_display/FoodDisplay";

export const Home = () => {
    const [category, setCategory] = useState("All");
    return (
        <div>
            <Header/>
            <ExploreMenu category={category} setCategory={setCategory}/>
            <FoodDisplay />
        </div>
    )
}