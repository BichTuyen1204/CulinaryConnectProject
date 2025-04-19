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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");

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

  const getSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };

  const getSearchType = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("type") || "name";
  };

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
        setFilteredProducts([]);
        return;
      }

      const filtered = await applyFilters(
        response.content,
        getSearchQuery(),
        getSearchType()
      );

      setFilteredProducts(normalizeProductData(filtered));
      setTotalPages(response.totalPage || 1);
    } catch (error) {
      setFilteredProducts([]);
    }
  };

  const applyFilters = async (data, searchQuery, searchType) => {
    if (searchQuery.trim() === "") {
      return data;
    }

    try {
      if (searchType === "name") {
        const nameResponse = await ProductService.getProductsBySearch(
          searchQuery
        );
        const nameResults = Array.isArray(nameResponse)
          ? nameResponse
          : nameResponse?.content || [];

        if (nameResults.length > 0) {
          return nameResults;
        }

        const descResponse = await ProductService.searchDescription(
          searchQuery
        );
        return descResponse.content || [];
      }

      if (searchType === "desc") {
        const descResponse = await ProductService.searchDescription(
          searchQuery
        );
        return descResponse.content || [];
      }

      return [];
    } catch (error) {
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
      salePercent: product.sale_percent || product.salePercent || 0,
      description: product.description || "",
    }));
  };

  useEffect(() => {
    const newSearch = getSearchQuery();
    const newType = getSearchType();

    setSearchQuery(newSearch);
    setSearchType(newType);
  }, [location.search]);

  useEffect(() => {}, [filteredProducts]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [searchQuery, searchType, category, page]);

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
      <div className="food-page-container mt-4 bg-white p-4 rounded">
        {/* Category List */}
        <div className="category-section w-100">
          <h5 className="mb-3">Categories</h5>
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category-item ${category === cat ? "active" : ""}`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Food Grid */}
        <div className="col-12 d-flex flex-column justify-content-between">
          <div className="row gx-2 gy-1">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="custom-col"
                  style={{
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
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      borderRadius: "12px",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <Link
                      to={`/food_detail/${product.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="position-relative">
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="card-img-top"
                          style={{
                            height: "130px",
                            objectFit: "cover",
                            padding: "5px",
                            borderRadius: "15px 15px 10px 10px",
                          }}
                        />
                        {(product.productStatus === "OUT_OF_STOCK" ||
                          product.productStatus === "NO_LONGER_IN_SALE") && (
                          <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white px-3 py-1 text-uppercase fw-bold rounded">
                            {product.productStatus === "OUT_OF_STOCK"
                              ? "Out of Stock"
                              : "No Longer in Sale"}
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <h6
                          className="card-title mb-2"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.productName}
                        </h6>
                        <p className="card-text mb-1 small">
                          <strong>Price: </strong>
                          {product.salePercent > 0 ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-1">
                                ${Number(product.price).toFixed(1)}
                              </span>
                              <span className="text-danger fw-bold">
                                $
                                {(
                                  Number(product.price) -
                                  (Number(product.price) *
                                    product.salePercent) /
                                    100
                                ).toFixed(1)}
                              </span>
                            </>
                          ) : (
                            <span>${Number(product.price).toFixed(1)}</span>
                          )}
                        </p>
                        {product.salePercent > 0 && (
                          <p className="mb-0 small">
                            <strong>Sale: </strong>
                            {product.salePercent}%
                          </p>
                        )}
                      </div>
                    </Link>
                    <div className="card-footer bg-white border-top-0 d-grid gap-2">
                      {username ? (
                        <>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              fontSize: "0.7em",
                            }}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.availableQuantity === 0}
                          >
                            Add to cart
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "tomato",
                              color: "white",
                              fontSize: "0.7em",
                            }}
                            onClick={() => handleBuyNow(product)}
                            disabled={product.availableQuantity === 0}
                          >
                            Buy now
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/sign_in"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              fontSize: "0.7em",
                            }}
                          >
                            Add to cart
                          </Link>
                          <Link
                            to="/sign_in"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "tomato",
                              color: "white",
                              fontSize: "0.7em",
                            }}
                          >
                            Buy now
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">
                No products available in this category.
              </p>
            )}
          </div>

          {/* Popup Add to Cart */}
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
                    backdropFilter: "blur(3px)",
                    zIndex: 999,
                  }}
                />
                <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "30px",
                    width: "300px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                    zIndex: 1000,
                    textAlign: "center",
                  }}
                >
                  <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                    />
                    <path className="checkmark__check" d="M14 26l7 7 15-15" />
                  </svg>

                  <p className="mt-2 text-success fw-bold">
                    Added to cart successfully
                  </p>
                </div>
              </>,
              document.body
            )}

          {/* Pagination at the bottom */}
          <div className="d-flex justify-content-center mt-4">
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
      </div>
    </div>
  );
};
