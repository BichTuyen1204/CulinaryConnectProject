import React, { useContext, useEffect, useState } from "react";
import "./Food_detail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountService from "../../api/AccountService";
import { MdArrowBackIosNew } from "react-icons/md";
import { CartContext } from "../../components/context/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import ReactDOM from "react-dom";

export const Food_detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [username, setUserName] = useState("");
  const images = product.imagesUrl || [];
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [popupAdd, setPopupAdd] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const getDataDetail = async (id) => {
    try {
      const response = await ProductService.getProductDetail(id);
      setProduct(response);
    } catch (error) {
      console.error("Fail load data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getDataDetail(id);
      window.scrollTo(1, 0);
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

  useEffect(() => {
    const getAccount = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await AccountService.account(jwtToken);
          console.log(response);
          setUserName(response.username);
        } catch (error) {
          console.error("Error fetching account information:", error);
        }
      }
    };
    getAccount();
  }, [jwtToken]);

  const handleAddToCart = async () => {
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

  const handleBuyNow = async () => {
    if (username) {
      await addToCart(product);
      navigate("/cart");
    } else {
      navigate("/sign_in");
    }
  };

  return (
    <div>
      <div>
        <div className="bg-white">
          <div className="d-flex p-3">
            <Link to="/food_card">
              <MdArrowBackIosNew className="icon-back-pro-detail" />
            </Link>
            <p className="mx-5">
              <strong>{product.productTypes}</strong>
            </p>
          </div>
        </div>
        <div className="bg-white p-3 mt-2 bg-big-pro-detail">
          <div className="main-product-wrapper mt-5">
            <div className="container-xxl">
              <div className="productDetail col-12 row">
                <div className="productDetail-img col-7">
                  <div className="productdisplay-img-wrapper">
                    {/* Ảnh lớn */}
                    <Swiper
                      spaceBetween={10}
                      navigation
                      pagination={{ clickable: true }}
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[Navigation, Pagination, Thumbs]}
                      className="productdisplay-img-large"
                    >
                      {images.map((url, index) => (
                        <SwiperSlide key={index}>
                          <img
                            className="img-big-detail"
                            src={url}
                            alt={`Product ${index + 1}`}
                            style={{
                              padding: "15px",
                              width: "100%",
                              borderRadius: "15px",
                              height: "100%",
                              objectFit: "contain",
                              backgroundColor: "white",
                              border: "2px solid green",
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Ảnh nhỏ (Thumbnail) */}
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView="auto"
                      watchSlidesProgress
                      modules={[Thumbs]}
                      className="productdisplay-img-thumbnails"
                    >
                      {images.map((url, index) => (
                        <SwiperSlide key={index} style={{ width: "auto" }}>
                          <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="thumbnail"
                            style={{
                              width: "80px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>

                <div className="productDetail-content col-5">
                  <div className="">
                    <div className="main-product-details">
                      <div className="border-bottom">
                        <h3 className="title-of-product-detail">
                          {product.name}
                        </h3>
                      </div>

                      <div className="border-bottom">
                        <p className="price text-dark link mb-2">
                          Price:
                          {product.salePercent > 0 ? (
                            <>
                              <span className="mx-1 original-price">
                                ${Number(product.price).toFixed(2)}
                              </span>
                              <span className="discounted-price">
                                $
                                {(
                                  Number(product.price) -
                                  (Number(product.price) *
                                    Number(product.salePercent)) /
                                    100
                                ).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="mx-1">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="border-bottom py-1 info-of-product-detail">
                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">Category: </h3>
                          <p className="product-data">{product.productTypes}</p>
                        </div>

                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">Weight: </h3>
                          <p className="product-data">
                            {product.infos?.weight} gam
                          </p>
                        </div>

                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">
                            Days Before Expiry:{" "}
                          </h3>
                          <p className="product-data">
                            {product.daysBeforeExpiry} days
                          </p>
                        </div>

                        {product.salePercent > 0 ? (
                          <div className="d-flex gap-10 align-items-center my-2">
                            <h3
                              className="product-heading"
                              style={{ color: "red" }}
                            >
                              <strong>Sale:</strong>{" "}
                            </h3>
                            <p
                              className="product-data"
                              style={{ color: "red" }}
                            >
                              <strong>{product.salePercent} %</strong>
                            </p>
                          </div>
                        ) : null}

                        {product.availableQuantity > 0 ? (
                          <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                            <h3 className="product-heading">Quantity: </h3>
                            <p className="product-data">In stock</p>
                          </div>
                        ) : product.availableQuantity > 0 ? (
                          <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                            <h3 className="product-heading">Quantity: </h3>
                            <p className="product-data">Out of stock</p>
                          </div>
                        ) : null}
                      </div>

                      {username ? (
                        <div className="button-in-item mt-3">
                          <button
                            className="button-addtocart"
                            onClick={handleAddToCart}
                            disabled={product.availableQuantity === 0}
                          >
                            Add to cart
                          </button>
                          <button
                            className="button-buynow"
                            onClick={handleBuyNow}
                            disabled={product.availableQuantity === 0}
                          >
                            Buy now
                          </button>
                        </div>
                      ) : (
                        <div className="button-in-item mt-3">
                          <button className="button-addtocart">
                            <Link to="/sign_in">Add to cart</Link>
                          </button>
                          <button className="button-buynow">
                            <Link to="/sign_in">Buy now</Link>
                          </button>
                        </div>
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
                </div>

                {/* Information about product */}
                <div className="mt-5">
                  <p style={{ fontSize: "1.2em" }}>
                    <strong>INFORMATION OF PRODUCT</strong>
                  </p>
                  <p style={{ fontSize: "0.9em" }} className="px-4">
                    {product.description}
                  </p>
                </div>

                <div className="product-table-container">
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {product && product.infos && (
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          border: "1px solid #ddd",
                        }}
                      >
                        <tbody>
                          {Object.entries(product.infos).map(
                            ([key, value], index) => (
                              <tr
                                key={index}
                                style={{ border: "1px solid #ddd" }}
                              >
                                <td
                                  className="bg-for-des-pro"
                                  style={{
                                    padding: "12px 15px",
                                    border: "1px solid #ddd",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  <strong className="text-description">
                                    {key.replace(/_/g, " ")}
                                  </strong>
                                </td>
                                <td
                                  className="text-description"
                                  style={{
                                    padding: "12px 15px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  {value}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* article */}
                  <div>
                    <p
                      style={{
                        textTransform: "uppercase",
                        wordSpacing: "10px",
                        fontSize: "1.2em",
                        marginTop: "55px",
                      }}
                    >
                      <strong className="d-flex">
                        ARTICLE ABOUT{" "}
                        <span
                          style={{
                            color: "tomato",
                            wordSpacing: "5px",
                            marginLeft: "8px",
                          }}
                        >
                          {product.name}
                        </span>
                      </strong>
                    </p>

                    <p
                      style={{ fontSize: "0.9em" }}
                      className="px-4"
                      dangerouslySetInnerHTML={{ __html: product.articleMD }}
                    />
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
