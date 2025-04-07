import React, { useEffect, useState } from "react";
import "../blog/Blog.css";
import BlogService from "../../api/BlogService";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import { motion } from "framer-motion";

const Blog = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showSavedDishes, setShowSavedDishes] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState("name");

  // Search term change handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Tag input change handler
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Handle tag addition
  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Fetch bookmarked blogs
  const fetchBookmarkedBlogs = async () => {
    if (jwtToken) {
      try {
        const data = await BlogService.getAllBookMark(jwtToken);
        setBookmarkedBlogs(data);
      } catch (error) {}
    }
  };

  const getAllBlog = async (page, pageSize) => {
    if (jwtToken) {
      try {
        const response = await BlogService.getAllBlog(page, pageSize);
        setBlogs(response.content || []);
        setTotalPages(response.totalPage || 1);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch (error) {}
    } else {
      navigate("/sign_in");
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!jwtToken) {
        navigate("/sign_in");
        return;
      }

      try {
        if (searchTerm.trim() !== "") {
          if (searchType === "name") {
            const response = await BlogService.getSearchBlog(searchTerm);
            setBlogs(
              Array.isArray(response) ? response : response.content || []
            );
            setTotalPages(1);
          } else if (searchType === "desc") {
            const response = await BlogService.searchDescriptionBlog(
              page,
              pageSize,
              searchTerm
            );
            setBlogs(response.content || []);
            setTotalPages(response.totalPage || 1);
          }
        } else {
          getAllBlog(page, pageSize);
        }
      } catch (error) {}
      fetchBookmarkedBlogs();
    };

    fetchBlogs();
  }, [searchTerm, searchType, page]);

  // Check if a blog is bookmarked
  const isBookmarked = (blogId) => {
    return bookmarkedBlogs.some((blog) => blog.id === blogId);
  };

  // Handle save/unsave blog
  const handleSaveDish = async (blogId) => {
    if (jwtToken) {
      try {
        const currentStatus = isBookmarked(blogId);
        const newStatus = !currentStatus;

        const result = await BlogService.addBookMark(
          blogId,
          newStatus,
          jwtToken
        );
        if (result === true) {
          if (newStatus) {
            const addedBlog = blogs.find((blog) => blog.id === blogId);
            setBookmarkedBlogs((prev) => [...prev, addedBlog]);
          } else {
            setBookmarkedBlogs((prev) =>
              prev.filter((blog) => blog.id !== blogId)
            );
          }
        }
      } catch (error) {}
    } else {
      navigate("/sign_in");
    }
  };

  // Toggle saved dishes view
  const toggleSavedView = () => {
    setShowSavedDishes((prevState) => !prevState);
  };

  // Filter blogs based on search term and saved dishes toggle
  const filteredBlogs = (blogs || [])
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((post) => {
      if (showSavedDishes) {
        return isBookmarked(post.id);
      }
      return true;
    });

  // Fetch blogs and bookmarked blogs on component mount or dependency change
  useEffect(() => {
    getAllBlog(page, pageSize);
    fetchBookmarkedBlogs();
  }, [jwtToken, tags, page]);

  // Handle page change for pagination
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  useEffect(() => {
    getAllBlog(page, pageSize);
  }, [searchTerm, tags, page]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.3,
      }}
    >
      <div className="App">
        <header className="header-blog">
          <div className="logo">CULINARY CONNECT</div>
          <div className="search-input-group">
            <input
              type="text"
              placeholder={`Search by ${
                searchType === "name" ? "name" : "description"
              }...`}
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-dropdown"
            >
              <div className="option-choose-blog">
                <option value="name">Name</option>
                <option value="desc">Description</option>
              </div>
            </select>
          </div>

          <div className="saved-items">
            <button onClick={toggleSavedView}>
              {showSavedDishes ? "Show All Dishes" : "Show Saved Dishes"}:{" "}
              {bookmarkedBlogs.length}
            </button>
          </div>
        </header>

        <div className="container-bg col-12 mt-3">
          <main className="main-content col-12">
            <div className="blog-list col-12">
              {filteredBlogs.length === 0 ? (
                <p className="text-center">No blogs to display.</p>
              ) : (
                filteredBlogs.map((post) => (
                  <div key={post.id} className="blog-post">
                    <Link to={`/blog_detail/${post.id}`}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="post-image"
                      />
                    </Link>
                    <div className="post-content">
                      <h2>{post.title}</h2>
                      <button
                        className={`button-save-dish ${
                          isBookmarked(post.id) ? "saved" : ""
                        }`}
                        onClick={() => handleSaveDish(post.id)}
                      >
                        {isBookmarked(post.id) ? "Saved" : "Save Dish"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}

            <div className="pagination-container-blog">
              <Pagination className="custom-pagination-blog">
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
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default Blog;
