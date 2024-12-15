import React, { useEffect, useState } from "react";
import "./Food_card.css";
import image from "../../assets/image_food_menu.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useParams, useLocation } from "react-router-dom";

export const Food_card = () => {
  const categories = ["All", "Meal kit", "Vegetables", "Meat", "Season"];
  const [products, setProducts] = useState([]); // All fetched products
  const [filteredProducts, setFilteredProducts] = useState([]); // Products to display
  const [category, setCategory] = useState("All"); // Selected category
  const { id } = useParams();
  const location = useLocation();

  // Function to get search query from URL
  const getSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };

  const [searchQuery, setSearchQuery] = useState(getSearchQuery());

  // Function to rename category to API-friendly format
  const renameCategory = (cat) => {
    const categoryMapping = {
      "All": "ALL",
      "Meal kit": "MEALKIT",
      "Vegetables": "VEGETABLE",
      "Meat": "MEAT",
      "Season": "SEASON",
    };
    return categoryMapping[cat] || cat.toUpperCase();
  };

  // Fetch products based on category
  const fetchProducts = async () => {
    try {
      let response;
      const renamedCategory = renameCategory(category);
      if (renamedCategory === "ALL") {
        response = await ProductService.getAllProduct();
      } else {
        response = await ProductService.getProductsByCategory(renamedCategory);
      }
      setProducts(response); // Set all products state
      applyFilters(response); // Filter based on search query
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Filter products based on search query and category
  const applyFilters = (data) => {
    let filtered = data;

    // If search query is empty, reset the filtered list to all products
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(getSearchQuery());
  }, [location.search]);

  // Fetch products and apply filters on category or search query change
  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [category, searchQuery]);

  return (
    <div>
      {/* Header Image */}
      <div className="image-menu">
        <div className="image-menu-contents">
          <img src={image} alt="Menu Header" />
        </div>
      </div>

      {/* Food Page */}
      <div className="food-page-container col-12 mt-5">
        {/* Category List */}
        <div className="category-section col-2">
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setCategory(cat)} // Update category state on click
                style={{
                  cursor: "pointer",
                  fontWeight: category === cat ? "bold" : "normal",
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Food Grid */}
        <div className="food-grid col-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="food-card col-2">
                <img src={product.imageUrl || image} alt={product.productName} />
                <div className="food-info">
                  <h5 className="food-name">{product.productName}</h5>
                  <div className="food-price-and-quantity">
                    <div className="food-price">
                      <strong>Price: </strong>
                      {product.price} VND
                    </div>
                    <div className="food-quantity">
                      <strong>Quantity: </strong>
                      {product.availableQuantity || "1"}
                    </div>
                  </div>
                  <div className="button-food-card">
                    <button className="bt-add-to-cart">Add to cart</button>
                    <button className="bt-buy-now">Buy now</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};
