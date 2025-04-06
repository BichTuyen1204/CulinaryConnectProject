import React, { useContext, useEffect, useState } from "react";
import "./Food_card.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../../components/context/Context";
import AccountService from "../../api/AccountService";
import { Pagination } from "react-bootstrap";
import ReactDOM from "react-dom";

export const Food_card = () => {
  const categories = ["All", "Meal kit", "Vegetables", "Meat", "Season"];
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUserName] = useState("");
  const [popupAdd, setPopupAdd] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 50;

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

  const getSearchType = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("type") || "name";
  };

  useEffect(() => {
    setSearchQuery(getSearchQuery());
    setSearchType(getSearchType());
  }, [location.search]);

  const [searchQuery, setSearchQuery] = useState(getSearchQuery());
  const [searchType, setSearchType] = useState(getSearchType());

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
        response = await ProductService.getAllProduct(page, pageSize);
      } else {
        response = await ProductService.getProductsByCategory(
          renamedCategory,
          page,
          pageSize
        );
      }
      if (!response || !response.content) {
        console.error("Invalid response:", response);
        setFilteredProducts([]);
        return;
      }
      const filtered = await applyFilters(
        response.content,
        searchQuery,
        searchType
      );
      setFilteredProducts(normalizeProductData(filtered));
      setTotalPages(response.totalPage || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      setFilteredProducts([]);
    }
  };

  const applyFilters = async (data) => {
    if (searchQuery.trim() === "") {
      return data;
    }
    try {
      const response = await ProductService.getProductsBySearch(searchQuery);

      if (response.content && response.content.length > 0) {
        return response.content;
      }
      const fallbackResponse = await ProductService.searchDescription(
        searchQuery
      );
      return fallbackResponse.content || [];
    } catch (error) {
      console.error("Error applying search filters:", error);
      return [];
    }
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
      description: product.description || "",
    }));
  };

  useEffect(() => {
    setSearchQuery(getSearchQuery());
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [category, searchQuery, page]);

  const handleAddToCart = async (product) => {
    if (username) {
      await addToCart(product);
      setPopupAdd(true);
      setTimeout(() => {
        setPopupAdd(false);
      }, 2500);
    } else {
      navigate("/sign_in");
    }
  };

  const handleBuyNow = async (product) => {
    if (username) {
      await addToCart(product);
      navigate("/cart");
    } else {
      navigate("/sign_in");
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div>
      {/* Food Page */}
      <div className="food-page-container col-12 mt-3 bg-white px-2 py-5">
        {/* Category List */}
        <div className="category-section px-2 col-1">
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
                  opacity:
                    product.productStatus === "OUT_OF_STOCK" ||
                    product.productStatus === "NO_LONGER_IN_SALE"
                      ? 0.5
                      : 1,
                  pointerEvents:
                    product.productStatus === "OUT_OF_STOCK" ||
                    product.productStatus === "NO_LONGER_IN_SALE"
                      ? "none"
                      : "auto",
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
                        src={product.imageUrl}
                        alt={product.productName}
                      />

                      {(product.productStatus === "OUT_OF_STOCK" ||
                        product.productStatus === "NO_LONGER_IN_SALE") && (
                        <div
                          className="out-of-stock"
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
                          {product.productStatus === "OUT_OF_STOCK"
                            ? "Out of Stock"
                            : "No Longer in Sale"}
                        </div>
                      )}
                    </div>

                    <div className="food-info mx-2" style={{ flexGrow: 1 }}>
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
                    style={{ paddingBottom: "5px" }}
                  >
                    <button
                      className="bt-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.availableQuantity === 0}
                    >
                      Add to cart
                    </button>
                    <button
                      className="bt-buy-now"
                      onClick={() => handleBuyNow(product)}
                      disabled={product.availableQuantity === 0}
                    >
                      Buy now
                    </button>
                  </div>
                ) : (
                  <div
                    className="button-food-card mb-2"
                    style={{ paddingBottom: "5px" }}
                  >
                    <Link to={"/sign_in"}>
                      <button className="bt-add-to-cart">Add to cart</button>
                    </Link>
                    <Link to={"/sign_in"}>
                      <button className="bt-buy-now">Buy now</button>
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center">
              No products available in this category.
            </p>
          )}
          {popupAdd &&
            ReactDOM.createPortal(
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(0.05em)",
                    WebkitBackdropFilter: "blur(6px)",
                    zIndex: 999,
                  }}
                ></div>
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "35px",
                    width: "400px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    zIndex: 1000,
                    textAlign: "center",
                  }}
                >
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    style={{
                      transform: "scale(0.3)",
                      animation: "scaleIn 0.5s ease-in-out both",
                      justifyContent: "space-between",
                    }}
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="4"
                      strokeMiterlimit="10"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="4"
                      strokeMiterlimit="10"
                      d="M14 26l7 7 15-15"
                    />
                  </svg>
                  <p
                    style={{
                      marginTop: "20px",
                      color: "green",
                      fontSize: "1.1em",
                      fontWeight: "600",
                    }}
                  >
                    Added to cart successfully
                  </p>
                </div>
              </>,
              document.body
            )}
        </div>
      </div>

      {/*Paging */}
      <div className="pagination-container-card">
        <Pagination className="custom-pagination-card">
          <Pagination.Prev
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === page}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};
