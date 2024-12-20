import React, { useEffect, useState } from "react";
import "../blog_detail/BlogDetail.css";
import ReactMarkdown from "react-markdown";
import BlogService from "../../api/BlogService";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";

const BlogDetail = () => {
  const { id } = useParams();
  const [blogDetail, setBlogDetail] = useState({});
  const [savedItems, setSavedItems] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comment, setComment] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getBlogDetail = async (id) => {
    try {
      const responseBlog = await BlogService.getBlogDetail(id);
      setBlogDetail(responseBlog);

      const responseComment = await BlogService.getAllComment(id);
      const sortedComments = responseComment.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setComment(sortedComments);
      console.log(responseComment);
    } catch (error) {
      console.error("Fail load data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getBlogDetail(id);
      // window.scrollTo(0, 0);
      const savedBookmarks =
        JSON.parse(localStorage.getItem("bookmarks")) || {};
      setIsBookmarked(savedBookmarks[id] || false);
    } else {
      console.error("ID is undefined");
    }
  }, [id]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    setIsBookmarked(savedBookmarks[id] || false);
  }, [id]);

  const newCommentChange = (e) => {
    const { value } = e.target;
    setNewComment(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment(e);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (newComment.trim() === "") {
      alert("Please comment before submit");
      return;
    } else {
      console.log("postId:", id);
      console.log("Comment:", newComment);
      try {
        const response = await BlogService.addComment(id, newComment);
        const saveDataCommentAdded = [...comment, response];
        const sortedComments = [...saveDataCommentAdded].sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        setComment(sortedComments);
        setNewComment("");
      } catch (error) {
        console.error("Can not add comment", error.response.data.detail);
      }
    }
  };

  return (
    <div className="outer-wrapper">
      {/* Header start */}
      {/* <header className="header-blog-detail mt-2">
        <div className="logo">CULINARY CONNECT</div>
        <input type="text" placeholder="Search..." className="search-bar" />
      </header> */}
      {/* Header end */}

      <div className="container-bg col-12 mt-3">
        <Link to="/blog" className="p-5">
          <IoArrowBackOutline className="ic_back mt-3" />
        </Link>
        {blogDetail.blog && (
          <div className="blog-detail">
            <div className="blog-header">
              <h1>
                <strong>{blogDetail.blog.title}</strong>
              </h1>
              <p className="p-font-size mb-4">{blogDetail.blog.description}</p>
              <img
                src={blogDetail.blog.imageUrl}
                alt={blogDetail.blog.title}
                className="blog-image"
              />

              {/* <div className="bookmark-container" onClick={toggleBookmark}>
                {isBookmarked ? (
                  <div className="bookmark-icon active">
                    <IoBookmarkOutline className="fa-bookmark" />
                  </div>
                ) : (
                  <div className="bookmark-icon">
                    <IoBookmarkOutline className="fa-bookmark" />
                  </div>
                )}
              </div> */}

              <p className="mt-3">{blogDetail.blog.title}</p>
            </div>

            <section className="blog-content mt-3">
              <ReactMarkdown>{blogDetail.blog.markdownText}</ReactMarkdown>
            </section>
            <aside className="blog-content">
              <h1 className="mt-3">Information</h1>
              <ul>
                <li>
                  <p>
                    <strong>Serves:</strong> {blogDetail.blog.infos.SERVING}{" "}
                    people
                  </p>
                </li>
                <li>
                  <strong>Cook time:</strong> {blogDetail.blog.infos.COOK_TIME}
                </li>
              </ul>
              <div className="tags">
                <h1>Tags:</h1>
                {blogDetail.blog.tags.map((tag) => (
                  <span key={tag} className="tag">
                    <strong>#{tag}</strong>
                  </span>
                ))}
              </div>
              <div className="related-products mt-3">
                <h1>Related Products:</h1>
                <ul>{blogDetail.blog.relatedProduct}</ul>
              </div>
            </aside>
          </div>
        )}
      </div>

      <div className="container-bg col-12 mt-3">
        <div className="comment-section mt-1">
          <h3 className="comment-title">Opinion: ( {comment.length} )</h3>

          {/* Khung nhập ý kiến */}
          <div className="comment-input">
            <textarea
              placeholder="Share your opinion"
              id="comment"
              value={newComment}
              onChange={newCommentChange}
              onKeyDown={handleKeyDown}
            />
            <button className="send-opinion" onClick={addComment}>
              Send
            </button>
          </div>

          {/* Tabs lọc bình luận */}
          <div className="comment-tabs">
            <span>Newest Comments</span>
          </div>

          {/* Danh sách bình luận */}
          <div className="comment-list pb-5">
            {comment.map((comments, index) => (
              <div className="comment-item col-12" key={index}>
                <div className="comment-header col-12">
                    <img
                      src={comments.profilePicture}
                      className="comment-avatar col-1"
                    />
                  <span className="comment-user col-8 mt-1">
                    {comments.accountName}
                  </span>
                  <span className="comment-time col-3 mt-1 d-flex justify-content-end">
                    {new Date(comments.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="comment-content mx-5">{comments.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogDetail;
