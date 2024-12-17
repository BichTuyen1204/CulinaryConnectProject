import React, { useEffect, useState } from "react";
import "../blog/Blog.css";
import BlogService from "../../api/BlogService";
import { Link, useNavigate } from "react-router-dom";

const Blog = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [blog, setBlog] = useState([]);
  const [savedDishStatus, setSavedDishStatus] = useState({});
  const [showSavedDishes, setShowSavedDishes] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const savedStatus =
      JSON.parse(localStorage.getItem("savedDishStatus")) || {};
    setSavedDishStatus(savedStatus);

    const savedDishes = Object.keys(savedStatus).filter(
      (key) => savedStatus[key]
    );
    setSavedItems(savedDishes);
  }, []);

  useEffect(() => {
    const getAllBlog = async () => {
      if (jwtToken !== "") {
        try {
          const response = await BlogService.getAllBlog(jwtToken);
          setBlog(response);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch (error) {}
      } else {
        navigate("/sign_in");
      }
    };
    getAllBlog();
  }, [jwtToken]);

  const handleSaveDish = async (blogId) => {
    if (jwtToken) {
      try {
        const currentStatus = savedDishStatus[blogId] || false;
        const newStatus = !currentStatus;
        await BlogService.addBookMark(blogId, newStatus);
        setSavedDishStatus((prevStatus) => {
          const updatedStatus = { ...prevStatus, [blogId]: newStatus };
          localStorage.setItem(
            "savedDishStatus",
            JSON.stringify(updatedStatus)
          );
          return updatedStatus;
        });

        if (newStatus) {
          setSavedItems((prevSaved) => [...prevSaved, blogId]);
        } else {
          setSavedItems((prevSaved) => prevSaved.filter((id) => id !== blogId));
        }
      } catch (error) {
        console.error("Failed to save or unsave dish:", error);
      }
    } else {
      navigate("/sign_in");
    }
  };

  const toggleSavedView = () => {
    setShowSavedDishes((prevState) => !prevState);
  };
  const filteredBlogs = showSavedDishes
    ? blog.filter((post) => savedDishStatus[post.id])
    : blog;

  return (
    <div className="App">
      {/* Header */}
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
            {showSavedDishes ? "Show All Dishes" : "Show Saved Dishes"}: {savedItems.length}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-bg col-12 mt-3">
        <main className="main-content col-12">
          {/* Danh Sách Blog */}
          <div className="blog-list col-12">
            {filteredBlogs.map((post) => (
              <div key={post.id} className="blog-post">
                <Link to={`/blog_detail/${post.id}`}>
                  <img src={post.imageUrl} alt="" className="post-image" />
                </Link>
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <button
                    className={`button-save-dish ${
                      savedDishStatus[post.id] ? "saved" : ""
                    }`}
                    onClick={() => handleSaveDish(post.id)}
                  >
                    {savedDishStatus[post.id] ? "Saved" : "Save Dish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Blog;
