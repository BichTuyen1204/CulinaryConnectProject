import React, { useState } from "react";
import "../blog/Blog.css";
const Blog = () => {
  const initialPosts = [
    {
      id: 1,
      title: "Món Phở Truyền Thống",
      description:
        "Một trong những món ăn nổi tiếng nhất của Việt Nam với nước dùng thơm ngon và sợi phở mềm mại.",
      image: "https://via.placeholder.com/200x150?text=Phở",
    },
    {
      id: 2,
      title: "Bún Chả Hà Nội",
      description:
        "Món ăn đặc sản của thủ đô Hà Nội với thịt nướng thơm lừng và bún tươi.",
      image: "https://via.placeholder.com/200x150?text=Bún+Chả",
    },
    {
      id: 3,
      title: "Gỏi Cuốn Tươi",
      description:
        "Món gỏi cuốn thanh mát với tôm, thịt, rau sống và nước chấm đặc biệt.",
      image: "https://via.placeholder.com/200x150?text=Gỏi+Cuốn",
    },
    {
      id: 4,
      title: "Cà Phê Sữa Đá",
      description:
        "Thức uống phổ biến của người Việt với hương vị đậm đà và ngọt ngào.",
      image: "https://via.placeholder.com/200x150?text=Cà+Phê",
    },
    // Thêm các bài viết khác ở đây
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSave = (post) => {
    if (!savedItems.find((item) => item.id === post.id)) {
      setSavedItems([...savedItems, post]);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const relatedPosts = posts.filter((post) => post.id !== 1).slice(0, 3);

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
            {filteredPosts.map((post) => (
              <div key={post.id} className="blog-post">
                <img src={post.image} alt={post.title} className="post-image" />
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p>{post.description}</p>
                  <button className="button-save-dish" onClick={() => handleSave(post)}>Save Dish</button>
                </div>
              </div>
            ))}
          </div>

          {/* Phần Bài Viết Liên Quan */}
          <div className="related-posts">
            <h3>Bài viết liên quan</h3>
            <ul>
              {relatedPosts.map((post) => (
                <li key={post.id}>
                  <a href={`#post-${post.id}`}>{post.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Blog;
