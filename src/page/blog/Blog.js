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
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // const handleSave = (post) => {
  //   if (!savedItems.find((item) => item.id === post.id)) {
  //     setSavedItems([...savedItems, post]);
  //   }
  // };

  useEffect(() => {
    const getAllBlog = async () => {
      if (jwtToken !== "") {
        try {
          const response = await BlogService.getAllBlog(jwtToken);
          setBlog(response);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } catch (error) {}
      } else {
        navigate("/sign_in");
      }
    };
    getAllBlog();
  }, [jwtToken]);

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
          <span>Saved Dishes: {savedItems.length}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-bg col-12 mt-3">
        <main className="main-content col-12">
          {/* Danh Sách Blog */}
          <div className="blog-list col-12">
            
              {blog.map((post) => (
                <Link to={`/blog_detail/${post.id}`}>
                <div key={post.id} className="blog-post">
                  <img src={post.imageUrl} alt="" className="post-image" />
                  <div className="post-content">
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                    <button
                      className="button-save-dish"
                      // onClick={() => handleSave(post)}
                    >
                      Save Dish
                    </button>
                  </div>
                </div>
                </Link>
              ))}
            
          </div>

          {/* Phần Bài Viết Liên Quan */}
          {/* <div className="related-posts">
            <h3>Bài viết liên quan</h3>
            <ul>
              {relatedPosts.map((post) => (
                <li key={post.id}>
                  <a href={`#post-${post.id}`}>{post.title}</a>
                </li>
              ))}
            </ul>
          </div> */}
        </main>
      </div>
    </div>
  );
};
export default Blog;
