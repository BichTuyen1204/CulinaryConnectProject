import React, { useContext, useEffect, useState } from "react";
import "./Food_card.css";
import image from "../../assets/image_food_menu.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../../components/context/Context";
import AccountService from "../../api/AccountService";

export const Food_card = () => {
  const categories = ["All", "Meal kit", "Vegetables", "Meat", "Season"];
  const [product, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUserName] = useState("");
  const [popupAdd, setPopupAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
        } catch (error) {}
      } else {
        setUserName("");
      }
    };
    getAccount();
  }, [jwtToken]);

  // Function to get search query from URL
  const getSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };

  const [searchQuery, setSearchQuery] = useState(getSearchQuery());

  // Function to rename category to API-friendly format
  const renameCategory = (cat) => {
    const categoryMapping = {
      All: "ALL",
      "Meal kit": "MEALKIT",
      Vegetables: "VEGETABLE",
      Meat: "MEAT",
      Season: "SEASON",
    };
    return categoryMapping[cat] || cat.toUpperCase();
  };

  const fetchProducts = async () => {
    try {
      let response;
      const renamedCategory = renameCategory(category);

      if (renamedCategory === "ALL") {
        response = await ProductService.getAllProduct();
      } else {
        response = await ProductService.getProductsByCategory(renamedCategory);
      }
      // setProducts(response);
      await applyFilters(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const applyFilters = async (data) => {
    let filtered = data;
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length === 0) {
        try {
          const descriptionResults = await ProductService.searchDescription(
            searchQuery
          );
          const normalizedDescriptionResults =
            normalizeProductData(descriptionResults);
          setFilteredProducts(normalizedDescriptionResults);
          return;
        } catch (error) {
          console.error("Error searching by description:", error);
        }
      }
    }
    const normalizedProducts = normalizeProductData(filtered);
    setFilteredProducts(normalizedProducts);
  };

  const normalizeProductData = (products) => {
    return products.map((product) => ({
      id: product.id,
      productName: product.product_name || product.productName,
      availableQuantity:
        product.available_quantity || product.availableQuantity,
      productTypes: product.product_types || product.productTypes,
      productStatus: product.product_status || product.productStatus,
      imageUrl: product.image_url || product.imageUrl,
      price: product.price,
      salePercent: product.sale_percent || product.salePercent,
    }));
  };

  useEffect(() => {
    setSearchQuery(getSearchQuery());
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [category, searchQuery]);

  const handleAddToCart = async (product) => {
    if (username) {
      await addToCart(product);
      setPopupAdd(true);
      setTimeout(() => {
        setPopupAdd(false);
      }, 1000);
    } else {
      navigate("/sign_in");
    }
  };
  return (
    <div>
      {/* Food Page */}
      <div className="food-page-container col-12 mt-3 bg-white px-2 py-5">
        {/* Category List */}
        <div className="category-section px-5 col-2">
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setCategory(cat)}
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
        <div className="food-grid col-11">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="food-card col-2"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  opacity: product.availableQuantity === 0 ? 0.5 : 1,
                  pointerEvents:
                    product.availableQuantity === 0 ? "none" : "auto",
                }}
              >
                <div>
                  <Link to={`/food_detail/${product.id}`}>
                    <div
                      className="food-item-img-container"
                      style={{
                        position: "relative",
                      }}
                    >
                      <img
                        className="food-item-image"
                        src={product.imageUrl || image}
                        alt={product.productName}
                      />

                      {product.availableQuantity === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "black",
                            color: "white",
                            padding: "10px 15px",
                            fontSize: "0.8em",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            textAlign: "center",
                            borderRadius: "0px",
                          }}
                        >
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="food-info mx-3" style={{ flexGrow: 1 }}>
                      <h5 className="food-name">{product.productName}</h5>
                      <div className="food-price-and-quantity">
                        <p className="food-item-price">
                          <strong>Price:</strong>{" "}
                          {product.salePercent > 0 ? (
                            <>
                              <span className="original-price">
                                ${product.price.toFixed(2)}
                              </span>{" "}
                              <span className="discounted-price">
                                $
                                {(
                                  product.price -
                                  (product.price * product.salePercent) / 100
                                ).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span>${product.price.toFixed(2)}</span>
                          )}
                        </p>
                        <div className="food-quantity">
                          {product.availableQuantity > 0 ? (
                            <p className="food-item-quantity">
                              <strong className="link">
                                Quantity: In stock
                              </strong>
                            </p>
                          ) : product.availableQuantity === 0 ? (
                            <p className="food-item-quantity mt-2">
                              <strong className="link">
                                Quantity: Out of stock
                              </strong>
                            </p>
                          ) : null}
                        </div>
                        {product.salePercent > 0 ? (
                          <p className="food-item-quantity">
                            <strong className="link">Sale:</strong>{" "}
                            {product.salePercent} %
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </div>

                {username ? (
                  <div
                    className="button-food-card mb-2"
                    style={{ marginTop: "-15px", paddingBottom: "5px" }}
                  >
                    <button
                      className="bt-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.availableQuantity === 0}
                    >
                      Add to cart
                    </button>
                    <button className="bt-buy-now">Buy now</button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center">
              No products available in this category.
            </p>
          )}
          {popupAdd && (
            <div className="popup">
              <div className="popup-content">
                <h5>Added to cart !</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
