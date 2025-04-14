import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;
const REACT_APP_BACKEND_API_ENDPOINT_SEARCH =
  process.env.REACT_APP_BACKEND_API_ENDPOINT_SEARCH;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/fetch`;

class ProductService {
  async getAllProduct(pageNo, pageSize) {
    try {
      const response = await axios.get(
        `${API_BASE_URL_2}/product/all?pageNo=${
          pageNo - 1
        }&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductDetail(id) {
    try {
      const response = await axios.get(`${API_BASE_URL_2}/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCategory(category, pageNo, pageSize) {
    try {
      const response = await axios.get(
        `${API_BASE_URL_2}/product/category/${category}?pageNo=${
          pageNo - 1
        }&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductsBySearch(keyword) {
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/search/product?keyword=${encodeURIComponent(
          keyword
        )}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchDescription(desc) {
    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT_SEARCH}/public/search/desc?text_dist=0.7&img_dist=1&index=0&size=7`,
        {
          prompt: desc,
        }
      );
      return response.data;
    } catch (error) {
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
        `${REACT_APP_BACKEND_API_ENDPOINT_SEARCH}/public/search/image?yolo_dist=2.0&clip_dist=0.6&index=0&size=7`,
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
      throw error;
    }
  }
}
export default new ProductService();
