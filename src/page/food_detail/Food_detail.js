import React, { useEffect, useState } from "react";
import "./Food_detail.css";
import Fish from "../../assets/ca_dieu_hong.png";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useParams } from "react-router-dom";

export const Food_detail = () => {
  const [product, setProduct] = useState("");
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.imagesUrl || [];

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
                      style={{ position: "relative" }}
                    >
                      <img
                        className="productdisplay-main-img img-detail"
                        src={images[currentImageIndex]}
                        alt="Product"
                        style={{
                          width: "100%",
                          height: "auto",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
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
                          // onClick={() => handleAddToCart(product.idBook)}
                          // disabled={product.quantity === 0}
                        >
                          Add to cart
                        </button>
                        {/* <PopupCart
                            trigger={buttonPopup}
                            setTrigger={setButtonPopup}
                          >
                            <h3 className="text-in-popup">{titleInfo}</h3>
                            <p>{contentInfo}</p>
                          </PopupCart> */}

                        <button
                          className="button button-food-detail button-buy-now"
                          type="submit"
                          // onClick={() => handleBuyNow(product.idBook)}
                          // disabled={product.quantity === 0}
                        >
                          Buy now
                        </button>

                        {/* <PopuBuyNow
                            trigger={buttonPopupBuyNow}
                            setTrigger={setButtonPopupBuyNow}
                          >
                            <h3 className="text-in-popup">{titleInfoBuy}</h3>
                            <p>{contentInfoBuy}</p>
                          </PopuBuyNow> */}
                      </div>
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
