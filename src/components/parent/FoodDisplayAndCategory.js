import React, { useState, useEffect } from "react";
import ExploreMenu from "../../components/menu/ExploreMenu";
import { FoodDisplay } from "../../components/food_display/FoodDisplay";
import ProductService from "../../api/ProductService";
import { Pagination } from "react-bootstrap";
import "./MenuPage.css";

const MenuPage = () => {
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        switch (category) {
          case "All":
            response = await ProductService.getAllProduct(page, pageSize);
            break;
          case "Meal Kit":
            response = await ProductService.getProductsByCategory(
              "MEALKIT",
              page,
              pageSize
            );
            break;
          case "Vegetable":
            response = await ProductService.getProductsByCategory(
              "VEGETABLE",
              page,
              pageSize
            );
            break;
          case "Meat":
            response = await ProductService.getProductsByCategory(
              "MEAT",
              page,
              pageSize
            );
            break;
          case "Season":
            response = await ProductService.getProductsByCategory(
              "SEASON",
              page,
              pageSize
            );
            break;
          default:
            response = { content: [], totalPages: 1 };
            break;
        }
        setProducts(response.content);
        setTotalPages(response.totalPage);
      } catch (error) {}
    };

    fetchProducts();
  }, [category, page]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay products={products} />

      {/* Custom Pagination */}
      <div className="pagination-container">
        <Pagination className="custom-pagination">
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

export default MenuPage;
