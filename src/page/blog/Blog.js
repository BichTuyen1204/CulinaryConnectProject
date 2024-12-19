import React, { useEffect, useState } from "react";
import "../blog/Blog.css";
import BlogService from "../../api/BlogService";
import { Link, useNavigate } from "react-router-dom";

const Blog = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showSavedDishes, setShowSavedDishes] = useState(false);

  // Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get all bookmark
  const fetchBookmarkedBlogs = async () => {
    if (jwtToken) {
      try {
        const data = await BlogService.getAllBookMark(jwtToken);
        setBookmarkedBlogs(data);
      } catch (error) {
        console.error("Error fetching bookmarked blogs:", error);
      }
    }
  };

  // Get all blogs
  const getAllBlog = async () => {
    if (jwtToken) {
      try {
        const response = await BlogService.getAllBlog(jwtToken);
        setBlogs(response);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    } else {
      navigate("/sign_in");
    }
  };

  // Call data
  useEffect(() => {
    getAllBlog();
    fetchBookmarkedBlogs();
  }, [jwtToken]);

  // Check bookmark on blog
  const isBookmarked = (blogId) => {
    return bookmarkedBlogs.some((blog) => blog.id === blogId);
  };

  // Add or delete bookmark
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
          console.log(
            `Blog ${newStatus ? "bookmarked" : "unbookmarked"} successfully.`
          );
        } else {
          console.log("Not success when add bookmark");
        }
      } catch (error) {
        console.error("Failed to save or unsave blog:", error);
      }
    } else {
      navigate("/sign_in");
    }
  };

  // Show all saved blog
  const toggleSavedView = () => {
    setShowSavedDishes((prevState) => !prevState);
  };

  // UI for search and show blog
  const filteredBlogs = blogs
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

  return (
    <div className="App">
      <header className="header-blog">
        <div className="logo">CULINARY CONNECT</div>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
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
                    <p>{post.description}</p>
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
        </main>
      </div>
    </div>
  );
};

export default Blog;
