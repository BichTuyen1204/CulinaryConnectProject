import React, { useEffect, useState } from "react";
import "../blog_detail/BlogDetail.css";
import ReactMarkdown from "react-markdown";
import BlogService from "../../api/BlogService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import AccountService from "../../api/AccountService";

const BlogDetail = () => {
  const { id } = useParams();
  const [blogDetail, setBlogDetail] = useState({});
  const [savedItems, setSavedItems] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [comment, setComment] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  const navigate = useNavigate();
  const [username, setUserName] = useState("");

  useEffect(() => {
    if (!jwtToken) {
      navigate("/sign_in");
      return;
    } else {
      const getAccount = async () => {
        try {
          const response = await AccountService.account(jwtToken);
          setUserName(response.username);
        } catch (error) {
          console.error("Error fetching account information:", error);
          sessionStorage.removeItem("jwtToken");
          navigate("/sign_in");
        }
      };
      getAccount();
    }
  }, [jwtToken, navigate]);

  const cancelDelete = () => {
    setPopupDelete(false);
  };

  const openModal = (id) => {
    setSelectedId(id); // Lưu id của coupon
    setPopupDelete(true);
  };

  const deleteProduct = async (id) => {
    if (jwtToken) {
      try {
        await BlogService.deleteComment(id);
        setComment((prevComment) =>
          prevComment.filter((comment) => comment.id !== id)
        );
        setPopupDelete(false);
      } catch (error) {
        console.error("Failed to delete comment:", error.message);
      }
    } else {
      return;
    }
  };

  const getBlogDetail = async (id) => {
    try {
      const responseBlog = await BlogService.getBlogDetail(id);
      setBlogDetail(responseBlog);

      const responseComment = await BlogService.getAllComment(id);
      const sortedComments = responseComment.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      setComment(sortedComments);
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

              <img
                src={blogDetail.blog.thumbnail}
                alt={blogDetail.blog.title}
                className="blog-image"
              />
            </div>

            <section className="blog-content mt-3">
              <ReactMarkdown>{blogDetail.blog.markdownText}</ReactMarkdown>
            </section>
            <aside className="blog-content">
              {/* Infor of blog start */}
              <div>
                <h1 className="mt-3" style={{ fontSize: "1.2em" }}>
                  Information
                </h1>
                <ul style={{ fontSize: "0.9em", marginTop: "-5px" }}>
                  <li>
                    <strong>Serves:</strong> {blogDetail.blog.infos.serves}{" "}
                    people
                  </li>
                  <li>
                    <strong>Cook time:</strong>{" "}
                    {blogDetail.blog.infos.cook_time} minutes
                  </li>
                </ul>
              </div>
              {/* Infor of blog end */}

              {/* Des of blog start */}
              <div>
                <h1 style={{ fontSize: "1.2em" }}>Description:</h1>
                <p
                  className="p-font-size mb-4"
                  style={{
                    fontSize: "0.9em",
                    marginTop: "-5px",
                    marginLeft: "25px",
                  }}
                >
                  {blogDetail.blog.description}
                </p>
              </div>

              {/* Des of blog end */}

              {/* Tags of blog start */}
              <div className="tags">
                <h1 style={{ fontSize: "1.2em" }}>Tags:</h1>
                <strong
                  style={{
                    fontSize: "0.9em",
                    marginTop: "-5px",
                    marginLeft: "25px",
                  }}
                >
                  {" "}
                  #{blogDetail.blog.infos.tags}{" "}
                </strong>
              </div>
              {/* Tags of blog end */}
            </aside>
          </div>
        )}
      </div>

      <div className="container-bg px-3 col-12 mt-3">
        <div className="comment-section mt-1">
          <div style={{ marginBottom: "-15px" }}>
            <p className="pt-3">
              <strong>Comments:</strong>
            </p>
          </div>
          {/* Khung nhập ý kiến */}
          <div className="comment-input">
            <textarea
              placeholder="Share your opinion"
              id="comment"
              className="mt-4"
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
          {comment.some((c) => c.accountName !== null) ? (
            <div className="comment-list pb-5">
              {comment.map((comments, index) =>
                comments.accountName !== null ? (
                  <div className="comment-item col-12" key={index}>
                    <div className="comment-header col-12">
                      <img
                        src={comments.profilePicture}
                        className="comment-avatar col-1"
                        alt=""
                      />
                      <span className="comment-user col-8 mt-1">
                        {comments.accountName}
                      </span>
                      <span className="comment-time col-3 mt-1 d-flex justify-content-end">
                        {new Date(comments.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex">
                      <p className="comment-content mx-5">{comments.comment}</p>

                      {username === comments.accountName && (
                        <RiDeleteBin6Line
                          className="ic-delete ms-auto"
                          onClick={() => openModal(comments.id)}
                        />
                      )}
                      {/* <RiDeleteBin6Line
                        className="ic-delete ms-auto"
                        onClick={() => openModal(comments.id)}
                      /> */}
                    </div>
                  </div>
                ) : (
                  <div key={index}></div>
                )
              )}
            </div>
          ) : (
            <div></div>
          )}

          {popupDelete && (
            <>
              {/* Nền mờ nhưng vẫn hiển thị dữ liệu phía sau */}
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(87, 87, 87, 0.2)", // Nền bán trong suốt
                  backdropFilter: "blur(0.05em)",
                  zIndex: "999",
                }}
                onClick={cancelDelete}
              ></div>

              {/* Popup nội dung */}
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "25px",
                  width: "400px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Đổ bóng
                  zIndex: "1000", // Đảm bảo popup nằm trên cùng
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    marginBottom: "20px",
                    color: "#333",
                    fontWeight: "bold",
                    fontSize: "1.15em",
                  }}
                >
                  Confirm Delete Comment
                </h3>
                <p
                  style={{
                    marginTop: "-10px",
                    color: "#555",
                    fontSize: "0.9em",
                  }}
                >
                  Are you sure you want to disable this coupon?
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() => deleteProduct(selectedId)}
                    style={{
                      flex: "1",
                      padding: "5px",
                      backgroundColor: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.8em",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#c62828")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#d32f2f")
                    }
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    style={{
                      flex: "1",
                      padding: "10px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.9em",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1565c0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#1976d2")
                    }
                  >
                    Cancel
                  </button>
                </div>
                <IoCloseSharp
                  className="ic-close"
                  onClick={cancelDelete}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default BlogDetail;
