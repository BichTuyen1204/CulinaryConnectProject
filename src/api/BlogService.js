import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/public";
const API_BASE_URL_2 = "http://localhost:8080/api/customer/blog";
class BlogService {
  async getAllBlog() {
    try {
      const response = await axios.get(`${API_BASE_URL}/fetch/blog/all`);
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getBlogDetail(id) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.get(`${API_BASE_URL}/fetch/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error during API calls: ",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }

  async getAllComment(id) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return null;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch/blog/comment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
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

  async addComment(id, comment) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return null;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL_2}/comment`,
        { },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
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
}
export default new BlogService();
