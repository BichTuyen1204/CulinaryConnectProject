import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./ListProductSearchImg.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductService from "../../api/ProductService";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../../components/context/Context";
import AccountService from "../../api/AccountService";

export const ListProductSearchImg = () => {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [popupAdd, setPopupAdd] = useState(false);
  const [jwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [predictedProduct, setPredictedProduct] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!jwtToken) return setUsername("");
      try {
        const response = await AccountService.account(jwtToken);
        setUsername(response.username);
      } catch (error) {}
    };
    fetchAccount();
  }, [jwtToken]);

  const renameCategory = useCallback((cat) => {
    const categoryMapping = {
      All: "ALL",
      "Meal kit": "MEALKIT",
      Vegetables: "VEGETABLE",
      Meat: "MEAT",
      Season: "SEASON",
    };
    return categoryMapping[cat] || cat.toUpperCase();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const renamedCategory = renameCategory(category);
      const response =
        renamedCategory === "ALL"
          ? await ProductService.getAllProduct()
          : await ProductService.getProductsByCategory(renamedCategory);

      // Cập nhật trạng thái dựa vào available_quantity
      const updatedProducts = response.map((product) => ({
        ...product,
        product_status:
          product.available_quantity === 0 ? "OUT_OF_STOCK" : "IN_STOCK",
      }));

      setProducts(updatedProducts);
    } catch (error) {}
  }, [category, renameCategory]);

  useEffect(() => {
    const updateProducts = () => {
      const imageSearchResults = sessionStorage.getItem("imageSearchResults");

      if (location.search.includes("imageSearch=true") && imageSearchResults) {
        try {
          const parsedResults = JSON.parse(imageSearchResults);
          setProducts(parsedResults.page?.content || []);

          if (parsedResults.predict) {
            setPredictedProduct({
              name: parsedResults.predict.name,
            });
          }
        } catch (error) {}
      } else {
        fetchProducts();
      }
    };

    updateProducts();
    window.addEventListener("storage", updateProducts);
    return () => window.removeEventListener("storage", updateProducts);
  }, [location.search, fetchProducts]);

  useEffect(() => {
    const storedImage = sessionStorage.getItem("uploadedImage");
    if (storedImage) {
      setUploadedImage(storedImage); // Hiển thị lại ảnh sau khi reload
    }
  }, []);

  const searchQuery = useMemo(() => {
    return new URLSearchParams(location.search).get("search") || "";
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    return searchQuery.trim()
      ? products.filter((product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;
  }, [products, searchQuery]);

  const handleAddToCart = async (product) => {
    if (!username) return navigate("/sign_in");
    await addToCart(product);
    setPopupAdd(true);
    setTimeout(() => setPopupAdd(false), 1000);
  };

  useEffect(() => {
    const updateImage = () => {
      const storedImage = sessionStorage.getItem("uploadedImage");
      setUploadedImage(storedImage);
    };
    updateImage();
    window.addEventListener("imageUpdated", updateImage);
    return () => {
      window.removeEventListener("imageUpdated", updateImage);
    };
  }, []);

  return (
    <div className="menu-container col-12">
      <div className="bg-white px-4 pt-1 pb-4">
        <p className="my-3">The image you uploaded:</p>
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
        ) : (
          <p>There is no image</p>
        )}
        <p className="my-4 px-4">
          Product found through image search :{" "}
          <strong style={{ fontStyle: "italic" }}>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 || filteredProducts.length === 0
              ? "product"
              : "products"}
          </strong>
        </p>

        <div className="menu-grid col-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="menu-card col-12">
                {/* Hình ảnh sản phẩm */}
                <div className="menu-image-wrapper col-5">
                  {product.available_quantity > 0 ? (
                    <Link to={`/food_detail/${product.id}`}>
                      <img
                        src={product.image_url}
                        alt={product.product_name || product.name}
                        className="menu-image"
                      />
                    </Link>
                  ) : (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="menu-image"
                      style={{ cursor: "not-allowed", opacity: 0.5 }}
                    />
                  )}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="menu-info col-7">
                  <h5 className="menu-name">
                    {product.product_name || product.name}
                  </h5>
                  <div className="line-bottom"></div>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: product.available_quantity > 0 ? "green" : "red",
                      }}
                    >
                      <strong className="text">
                        {product.available_quantity > 0
                          ? "IN STOCK"
                          : "OUT OF STOCK"}
                      </strong>
                    </span>
                  </p>

                  <p className="d-flex">
                    <strong>Type:</strong>
                    <div className="text">
                      {product.product_types === "SS"
                        ? "Season"
                        : product.product_types === "MEAT"
                        ? "Meat"
                        : product.product_types === "VEG"
                        ? "Vegetables"
                        : product.product_types === "MK"
                        ? "Meal kit"
                        : "Unknown"}
                    </div>
                  </p>

                  <p className="d-flex">
                    <strong>Available:</strong>{" "}
                    <div className="text">{product.available_quantity}</div>
                  </p>
                  <p>
                    <strong>Price: </strong>
                    {product.sale_percent > 0 ? (
                      <>
                        <span className="original-cost">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="discount-cost">
                          $
                          {(
                            product.price -
                            (product.price * product.sale_percent) / 100
                          ).toFixed(2)}{" "}
                        </span>
                        <span className="discount-rate">
                          (-{product.sale_percent}%)
                        </span>
                      </>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </p>

                  {product.available_quantity > 0 && (
                    <div className="menu-button-group">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn-add-menu"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No matching products found.</p>
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
