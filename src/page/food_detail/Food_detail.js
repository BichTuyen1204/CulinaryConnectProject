import React from "react";
import "./Food_detail.css";
import Fish from "../../assets/ca_dieu_hong.png";
import "bootstrap/dist/css/bootstrap.min.css";

export const Food_detail = () => {
  return (
    <div>
      <div>
        <div>
          <div className="main-product-wrapper mt-5">
            <div className="container-xxl">
              <div className="productDetail col-12 row">
                <div className="productDetail-img col-7">
                      <div className="productdisplay-img image">
                        <img
                          className="productdisplay-main-img img-detail"
                          src={Fish}
                          alt=""
                        />
                      </div>
                </div>

                <div className="productDetail-content col-5">
                  <div className="">
                    <div className="main-product-details">
                      <div className="border-bottom">
                        <h3 className="title">Fish</h3>
                      </div>

                      <div className="border-bottom">
                        <p className="price text-dark link">
                          Price: 50.000 VNĐ
                        </p>
                      </div>

                      <div className="border-bottom py-1">
                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">Category: </h3>
                          <p className="product-data">Fish</p>
                        </div>

                        <div className="d-flex gap-10 align-items-center my-2">
                          <h3 className="product-heading">Weight: </h3>
                          <p className="product-data">200g</p>
                        </div>

                        <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                          <h3 className="product-heading">Quantity: </h3>
                          <p className="product-data">40</p>
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
