import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/public";
const API_BASE_URL_2 = "http://localhost:8080/api/customer/blog";
const API_BASE_URL_3 = "http://localhost:8080/api/customer/fetch";

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


  async getSearchBlog(keyword, tags) {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/blog`, {
        params: {
          keyword,
          tags: tags.join(','), // Join tags as comma-separated string if necessary
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

  async addComment(postId, comment) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return null;
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL_2}/comment`, null, {
          params: {
            postId: postId,
            comment: comment,
          },
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
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
  }

  async addBookMark(blogId, bookmark) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.log("JWT token not found. Cannot add bookmark.");
      return null;
    } else {
      try {
        const response = await axios.put(
          `${API_BASE_URL_2}/bookmark?bookmark=${bookmark}&blogId=${blogId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (response.data) {
          console.log(`Bookmark ${bookmark}`);
        } else {
          console.log("Failed to update bookmark status.");
        }
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

  async getAllBookMark() {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return null;
    } else {
      try {
        const response = await axios.get(`${API_BASE_URL_3}/bookmarked-blog`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        console.log(response);
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
}
export default new BlogService();
