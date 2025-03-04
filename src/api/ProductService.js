import axios from "axios";

const API_BASE_URL_2 = "http://localhost:8080/api/public/fetch";

class ProductService {
  async getAllProduct() {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/product/all`);
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getProductDetail(id) {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/product/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getProductsByCategory(category) {
    try {
      const response = await axios.get(
        `${API_BASE_URL_2}/product/category/${category}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getProductsBySearch(keyword) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/public/search/product?keyword=${keyword}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async searchDescription(desc) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
      const response = await axios.post(
        "http://localhost:8000/public/search/desc",
        {
          prompt: desc,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching description:", error);
      throw error;
    }
  }

  async searchImage(formData) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("No JWT token found. Please log in again.");
      }
      const response = await axios.post(
        `http://localhost:8000/public/search/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Update failed: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}
export default new ProductService();
