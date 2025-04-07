import axios from "axios";

const REACT_APP_BACKEND_API_ENDPOINT =
  process.env.REACT_APP_BACKEND_API_ENDPOINT;
const REACT_APP_BACKEND_API_ENDPOINT_SEARCH =
  process.env.REACT_APP_BACKEND_API_ENDPOINT_SEARCH;
const API_BASE_URL = `${REACT_APP_BACKEND_API_ENDPOINT}/api/public`;
const API_BASE_URL_2 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer/blog`;
const API_BASE_URL_3 = `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer/fetch`;

class BlogService {
  async getAllBlog(pageNo, pageSize) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch/blog/all?pageNo=${
          pageNo - 1
        }&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSearchBlog(keyword) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/search/blog?keyword=${keyword}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchDescriptionBlog(index, size, desc) {
    try {
      const response = await axios.post(
        `${REACT_APP_BACKEND_API_ENDPOINT_SEARCH}/public/search/blog?prompt=Discover%20the%20history%2C%20nutritional%20value%2C%20and%20cultural&text_dist=0.8&index=${
          index - 1
        }&size=${size}`,
        {
          prompt: desc,
        }
      );
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  async getBlogReply(blogId, commentId, pageNo, pageSize) {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/fetch/blog/reply?blogId=${blogId}&commentId=${commentId}&pageNo=${
          pageNo - 1
        }&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllComment(id, pageNo, pageSize) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return null;
    }
    try {
      const response = await axios.get(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/public/fetch/blog/comment?id=${id}&pageNo=${
          pageNo - 1
        }&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(id) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return;
    }
    try {
      const response = await axios.delete(
        `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer/comment/deleted?commentId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async replyComment(postId, commentId, comment) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return null;
    } else {
      try {
        const response = await axios.post(
          `${REACT_APP_BACKEND_API_ENDPOINT}/api/customer/blog/reply?postId=${postId}&commentId=${commentId}&comment=${comment}`,

          {
            postId: postId,
            commentId: commentId,
            comment: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
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
        throw error;
      }
    }
  }

  async addBookMark(blogId, bookmark) {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
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
        return response.data;
      } catch (error) {
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
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
}
export default new BlogService();
