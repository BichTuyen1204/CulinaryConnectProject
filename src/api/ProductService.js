import axios from "axios";

const API_BASE_URL = "http://localhost:8080/debug";
const API_BASE_URL_2 = "http://localhost:8080/api/public/fetch";

class ProductService {
  async getAllProduct() {
    try {
      const debugResponse = await axios.get(`${API_BASE_URL}/map`);
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
      const response = await axios.get(`${API_BASE_URL_2}/product/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

}
export default new ProductService();
