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
import ReactDOM from "react-dom";

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
    setTimeout(() => setPopupAdd(false), 2400);
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
    <div className="menu-container container-fluid py-3">
      <div className="bg-white px-3 px-md-4 py-3 rounded shadow-sm">
        <p className="fs-5 fw-semibold mb-3">The image you uploaded:</p>

        {uploadedImage ? (
          <div className="d-flex flex-column flex-md-row align-items-start">
            {predictedProduct && (
              <div className="prediction-info p-3 border rounded me-md-4 mb-3 mb-md-0 w-100 w-md-50 bg-light">
                <p className="mb-1 fs-6">
                  <strong>Detected:</strong> {predictedProduct.name}
                </p>
              </div>
            )}
            <div className="w-100 w-md-50">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            </div>
          </div>
        ) : (
          <p className="text-muted">There is no image</p>
        )}

        <p className="my-4 px-2 fs-6">
          Product found through image search:{" "}
          <strong style={{ fontStyle: "italic" }}>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 || filteredProducts.length === 0
              ? "product"
              : "products"}
          </strong>
        </p>

        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-6 col-lg-4">
                <div className="border rounded p-3 h-100 d-flex flex-column shadow-sm">
                  {/* Hình ảnh sản phẩm */}
                  <div className="text-center mb-3">
                    {product.available_quantity > 0 ? (
                      <Link to={`/food_detail/${product.id}`}>
                        <img
                          src={product.image_url}
                          alt={product.product_name || product.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </Link>
                    ) : (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="img-fluid rounded"
                        style={{
                          maxHeight: "200px",
                          objectFit: "cover",
                          cursor: "not-allowed",
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-grow-1">
                    <h5 className="fw-semibold mb-2">
                      {product.product_name || product.name}
                    </h5>
                    <div className="mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            product.available_quantity > 0 ? "green" : "red",
                        }}
                      >
                        <strong>
                          {product.available_quantity > 0
                            ? "IN STOCK"
                            : "OUT OF STOCK"}
                        </strong>
                      </span>
                    </div>

                    <p className="mb-1">
                      <strong>Type:</strong>{" "}
                      <span className="text-muted">
                        {product.product_types === "SS"
                          ? "Season"
                          : product.product_types === "MEAT"
                          ? "Meat"
                          : product.product_types === "VEG"
                          ? "Vegetables"
                          : product.product_types === "MK"
                          ? "Meal kit"
                          : "Unknown"}
                      </span>
                    </p>

                    <p className="mb-1">
                      <strong>Available:</strong>{" "}
                      <span className="text-muted">
                        {product.available_quantity}
                      </span>
                    </p>

                    <p className="mb-3">
                      <strong>Price:</strong>{" "}
                      {product.sale_percent > 0 ? (
                        <>
                          <span className="text-decoration-line-through text-muted me-2">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-danger fw-bold me-2">
                            $
                            {(
                              product.price -
                              (product.price * product.sale_percent) / 100
                            ).toFixed(2)}
                          </span>
                          <span className="text-success">
                            (-{product.sale_percent}%)
                          </span>
                        </>
                      ) : (
                        <span className="fw-medium">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Nút Add to Cart */}
                  {product.available_quantity > 0 && (
                    <div className="text-end mt-auto">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-success btn-sm px-3"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted fs-6">
              No matching products found.
            </p>
          )}

          {/* Popup thêm vào giỏ */}
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
        </div>
      </div>
    </div>
  );
};
