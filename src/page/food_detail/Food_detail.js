import React, { useEffect, useState } from "react";
import "./Food_detail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useParams } from "react-router-dom";
import AccountService from "../../api/AccountService";
import CartService from "../../api/CartService";
import { FaLeaf, FaBox, FaInfoCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Food_detail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [username, setUserName] = useState("");
  const [accountRole, setAccountRole] = useState("");
  const images = product.imagesUrl || [];
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [popupAddDetail, setPopupAddDetail] = useState(false);

  // Xử lý khi nhấn nút Prev
  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Xử lý khi nhấn nút Next
  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Xử lý khi nhấn vào hình nhỏ
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const getDataDetail = async (id) => {
    try {
      const response = await ProductService.getProductDetail(id);
      console.log("Response data:", response);
      console.log("Product ID from URL:", id);
      setProduct(response);
    } catch (error) {
      console.error("Fail load data:", error);
    }
  };
  useEffect(() => {
    if (id) {
      getDataDetail(id);
      window.scrollTo(0, 0);
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

  useEffect(() => {
    const getAccount = async () => {
      if (jwtToken !== "") {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
          setAccountRole(response.role);
        } catch (error) {
          console.error("Error fetching account information:", error);
        }
      } else {
        setUserName("");
        setAccountRole("");
      }
    };
    getAccount();
  }, [jwtToken]);

  const addToCart = async () => {
    if (!jwtToken) {
      return;
    }
    try {
      const response = await CartService.addToCart(
        product.id,
        (product.quantity = 1)
      );
      setPopupAddDetail(true);
      setTimeout(() => {
        setPopupAddDetail(false);
      }, 1000);
      console.log("Add product successful:", response);
      return response;
    } catch (error) {}
  };
  return (
    <div>
      <div>
        <div>
          <div className="main-product-wrapper mt-5">
            <div className="container-xxl">
              <div className="productDetail col-12 row">
                <div className="productDetail-img col-7">
                  <div className="productdisplay-img-wrapper">
                    {/* Hình lớn */}
                    <div
                      className="productdisplay-img-large"
                      style={{
                        position: "relative",
                        alignItems: "center",
                        justifyItems: "center",
                      }}
                    >
                      <img
                        className="productdisplay-main-img"
                        src={images[currentImageIndex]}
                        alt="Product"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          alignItems: "center",
                          justifyItems: "center",
                        }}
                      />
                      {/* Nút Previous */}
                      <button
                        onClick={handlePrevClick}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "0px",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          color: "black",
                          border: "none",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                      >
                        &#9664;
                      </button>
                      {/* Nút Next */}
                      <button
                        onClick={handleNextClick}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "0px",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          color: "black",
                          border: "none",
                          borderRadius: "50%",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                      >
                        &#9654;
                      </button>
                    </div>

                    {/* Dải hình nhỏ */}
                    <div className="productdisplay-img-thumbnails">
                      {images.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          className={`thumbnail-img ${
                            currentImageIndex === index ? "active" : ""
                          }`}
                          onClick={() => handleImageClick(index)}
                          style={{
                            width: "80px",
                            height: "80px",
                            margin: "5px",
                            cursor: "pointer",
                            border:
                              currentImageIndex === index
                                ? "2px solid tomato"
                                : "1px solid #ccc",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="productDetail-content col-5">
                  <div className="">
                    <div className="main-product-details">
                      <div className="border-bottom">
                        <h3 className="title">{product.name}</h3>
                      </div>

                      <div className="border-bottom">
                        <p className="price text-dark link">
                          Price: {product.price} VNĐ
                        </p>
                      </div>

                      <div className="border-bottom py-1">
                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">Category: </h3>
                          <p className="product-data">{product.productTypes}</p>
                        </div>

                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">Weight: </h3>
                          <p className="product-data">{product.description}</p>
                        </div>

                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">
                            Days Before Expiry:{" "}
                          </h3>
                          <p className="product-data">
                            {product.daysBeforeExpiry}
                          </p>
                        </div>

                        <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                          <h3 className="product-heading">Quantity: </h3>
                          <p className="product-data">
                            {product.availableQuantity}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex gap-30 button-food-detail-outline">
                        <button
                          className="button button-food-detail"
                          type="submit"
                          onClick={addToCart}
                        >
                          Add to cart
                        </button>

                        <button
                          className="button button-food-detail button-buy-now"
                          type="submit"
                        >
                          Buy now
                        </button>
                        {popupAddDetail && (
                          <div className="popup-add-detail">
                            <div className="popup-content-detail">
                              <h5>Added to cart !</h5>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information about product */}
                <div className="product-detail-container mt-5">
                  <div className="product-info">
                    <p className="product-name">Information product</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-details">
                      <div className="detail-item">
                        <FaLeaf className="detail-icon" />
                        <span className="detail-label">Name of product:</span>
                        <span className="detail-value">{product.name}</span>
                      </div>
                      <div className="detail-item">
                        <FaBox className="detail-icon" />
                        <span className="detail-label">Weight:</span>
                        <span className="detail-value">{product.weight}</span>
                      </div>
                      <div className="detail-item">
                        <FaInfoCircle className="detail-icon" />
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">
                          {product.productTypes}
                        </span>
                      </div>
                      <div className="detail-item">
                        <FaBox className="detail-icon" />
                        <span className="detail-label">Expiry date:</span>
                        <span className="detail-value">
                          {product.daysBeforeExpiry}
                        </span>
                      </div>
                      <div className="detail-item">
                        <FaInfoCircle className="detail-icon" />
                        <span className="detail-label">Production site:</span>
                        <span className="detail-value">
                          {product.production}
                        </span>
                      </div>
                    </div>
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {product.articleMD}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
