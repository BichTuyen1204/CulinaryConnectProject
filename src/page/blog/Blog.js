import React, { useEffect, useState } from "react";
import "../blog/Blog.css";
import BlogService from "../../api/BlogService";
import { Link, useNavigate } from "react-router-dom";

const Blog = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]); 
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showSavedDishes, setShowSavedDishes] = useState(false);
  const [tagInput, setTagInput] = useState(""); 


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };


  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); 
      if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput(""); 
    }
  };

  
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


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


  const getAllBlog = async () => {
    if (jwtToken) {
      try {
        const response = await BlogService.getSearchBlog(searchTerm, tags);
        setBlogs(response);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    } else {
      navigate("/sign_in");
    }
  };


  useEffect(() => {
    getAllBlog();
    fetchBookmarkedBlogs();
  }, [jwtToken, tags]); 


  const isBookmarked = (blogId) => {
    return bookmarkedBlogs.some((blog) => blog.id === blogId);
  };


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


  const toggleSavedView = () => {
    setShowSavedDishes((prevState) => !prevState);
  };


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

        {/* <div className="tag-input">
          <input
            type="text"
            placeholder="Add tags..."
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyPress}
          />
          <div className="tags-list">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}{" "}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="remove-tag"
                >
                  X
                </button>
              </span>
            ))}
          </div>
        </div> */}

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
