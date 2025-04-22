import React, { useEffect, useState } from "react";
import "../blog_detail/BlogDetail.css";
import ReactMarkdown from "react-markdown";
import BlogService from "../../api/BlogService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import AccountService from "../../api/AccountService";
import { AiFillDelete } from "react-icons/ai";
import { AiFillFlag } from "react-icons/ai";
import { Pagination } from "react-bootstrap";
import ReactDOM from "react-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [blogDetail, setBlogDetail] = useState({});
  const [newComment, setNewComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdReply, setSelectedIdReply] = useState(null);
  const [selectedIdReport, setSelectedIdReport] = useState(null);
  const [selectedIdReportReply, setSelectedIdReportReply] = useState(null);
  const [comments, setComments] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [popupReport, setPopupReport] = useState(false);
  const [popupReportSuccess, setPopupReportSuccess] = useState(false);
  const [popupReportReply, setPopupReportReply] = useState(false);
  const [popupReportReplySuccess, setPopupReportReplySuccess] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  const [popupDeleteSuccess, setPopupDeleteSuccess] = useState(false);
  const [popupDeleteReply, setPopupDeleteReply] = useState(false);
  const [popupDeleteReplySuccess, setPopupDeleteReplySuccess] = useState(false);
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});
  const [pageBlog, setPageBlog] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSizeBlog = 50;
  const pageBlogReply = 1;
  const [commentVisibility, setCommentVisibility] = useState({});
  const [isLeftVisible, setIsLeftVisible] = useState(true);

  const toggleLeftColumn = () => {
    setIsLeftVisible((prev) => !prev);
  };

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
          sessionStorage.removeItem("jwtToken");
          navigate("/sign_in");
        }
      };
      getAccount();
    }
  }, [jwtToken, navigate]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPageBlog(pageNumber);
    }
  };

  const cancelDelete = () => {
    setPopupDelete(false);
  };

  const cancelDeleteReply = () => {
    setPopupDeleteReply(false);
  };

  const cancelReport = () => {
    setPopupReport(false);
  };

  const cancelReportReply = () => {
    setPopupReportReply(false);
  };

  const openModal = (id) => {
    setSelectedId(id);
    setPopupDelete(true);
  };

  const openModalReply = (id) => {
    setSelectedIdReply(id);
    setPopupDeleteReply(true);
  };

  const openReport = (id) => {
    setSelectedIdReport(id);
    setPopupReport(true);
  };

  const openReportReply = (id) => {
    setSelectedIdReportReply(id);
    setPopupReportReply(true);
  };

  const reportComment = async (id) => {
    if (jwtToken) {
      try {
        await BlogService.reportComment(id);
        setComments((prevComment) =>
          prevComment.filter((comment) => comment.id !== id)
        );
        setPopupReport(false);
        setPopupReportSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {}
    } else {
      return;
    }
  };

  const reportReply = async (id) => {
    if (jwtToken) {
      try {
        await BlogService.reportComment(id);
        setReplies((prevReplies) => {
          const updatedReplies = Object.keys(prevReplies).reduce(
            (acc, commentId) => {
              acc[commentId] = prevReplies[commentId].filter(
                (reply) => reply.id !== id
              );
              return acc;
            },
            {}
          );
          return updatedReplies;
        });
        setPopupReportReply(false);
        setPopupReportReplySuccess(true);
      } catch (error) {}
    } else {
      return;
    }
  };

  const deleteBlog = async (id) => {
    if (jwtToken) {
      try {
        await BlogService.deleteComment(id);
        setComments((prevComment) =>
          prevComment.filter((comment) => comment.id !== id)
        );
        setPopupDelete(false);
        setPopupDeleteSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {}
    } else {
      return;
    }
  };

  const deleteReply = async (id) => {
    if (jwtToken) {
      try {
        await BlogService.deleteComment(id);
        setReplies((prevReplies) => {
          const updatedReplies = Object.keys(prevReplies).reduce(
            (acc, commentId) => {
              acc[commentId] = prevReplies[commentId].filter(
                (reply) => reply.id !== id
              );
              return acc;
            },
            {}
          );
          return updatedReplies;
        });
        setPopupDeleteReply(false);
        setPopupDeleteReplySuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {}
    } else {
      return;
    }
  };

  const getBlogDetail = async (id) => {
    if (!jwtToken) {
      navigate("/sign-in");
      return;
    }
    try {
      const responseBlog = await BlogService.getBlogDetail(id);
      setBlogDetail(responseBlog);
    } catch (error) {}
  };

  const getAllComment = async (id) => {
    if (!jwtToken) {
      navigate("/sign-in");
      return;
    }
    try {
      const responseComment = await BlogService.getAllComment(
        id,
        pageBlog,
        pageSizeBlog
      );
      if (responseComment?.content?.length > 0) {
        const formattedComments = responseComment.content.map((item) => ({
          id: item.comment.id,
          accountName: item.comment.accountName,
          profilePicture: item.comment.profilePicture,
          timestamp: item.comment.timestamp,
          comment: item.comment.comment,
          replyAmount: item.replyAmount,
          status: item.status,
        }));

        setComments(formattedComments);
        console.log(responseComment.content.status);
        setTotalPages(responseComment.totalPage || 1);
        setTotalPages(responseComment.totalPage || 1);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      getAllComment(id);
    }
  }, [id, pageBlog]);

  const getReplies = async (blogId, commentId) => {
    try {
      const response = await BlogService.getBlogReply(
        blogId,
        commentId,
        pageBlogReply,
        pageSizeBlog
      );
      if (response.content && response.content.length > 0) {
        const formattedReplies = response.content.map((item) => ({
          id: item.comment.id,
          accountName: item.comment.accountName,
          profilePicture: item.comment.profilePicture,
          timestamp: item.comment.timestamp,
          comment: item.comment.comment,
          replyAmount: item.replyAmount,
          status: item.status,
        }));

        setReplies((prevReplies) => ({
          ...prevReplies,
          [commentId]: formattedReplies,
        }));
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {}, [replies]);

  const addReplyHandler = async () => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      accountName: "",
      profilePicture: "https://example.com/avatar.jpg",
      timestamp: new Date().toISOString(),
      comment: replyText,
      replyAmount: 0,
    };
    setReplies((prevReplies) => ({
      ...prevReplies,
      [replyingTo]: [...(prevReplies[replyingTo] || []), newReply],
    }));
    try {
      await BlogService.replyComment(id, replyingTo, replyText);
      getReplies(id, replyingTo);
    } catch (error) {
    } finally {
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const toggleReplies = (commentId) => {
    if (!commentVisibility[commentId] && !replies[commentId]) {
      getReplies(id, commentId);
    }
    setCommentVisibility((prevVisibility) => ({
      ...prevVisibility,
      [commentId]: !prevVisibility[commentId],
    }));
  };

  useEffect(() => {
    if (id) {
      getBlogDetail(id);
      getAllComment(id);

      const savedBookmarks =
        JSON.parse(localStorage.getItem("bookmarks")) || {};
      setIsBookmarked(savedBookmarks[id] || false);
    }
  }, [id]);

  const newCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await addCommentHandler();
    }
  };

  const handleKeyDownReply = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await addReplyHandler();
    }
  };

  const addCommentHandler = async () => {
    if (!newComment.trim()) return;
    try {
      await BlogService.addComment(id, newComment);
      setNewComment("");
      getAllComment(id);
    } catch (error) {}
  };

  return (
    <div className="fade-in">
      <div className="outer-wrapper">
        <div className="container-bg col-12 mt-3">
          <Link to="/blog" className="p-5">
            <IoArrowBackOutline className="ic_back mt-3" />
          </Link>
          {/* Show blog start*/}
          {blogDetail.blog && (
            <div>
              <p
                style={{
                  padding: "5px 20px",
                  textAlign: "center",
                  fontSize: "1.5em",
                  fontWeight: "600",
                }}
              >
                {blogDetail.blog.title}
              </p>
              <div className="blog-detail-container">
                {/* Toggle Button for Mobile View */}
                <button
                  className="toggle-left-column"
                  onClick={toggleLeftColumn}
                  style={{
                    display: "none",
                  }}
                >
                  {isLeftVisible ? "Hide Details" : "Show Details"}
                </button>

                {/* Left Section */}
                <div
                  className={`blog-left ${isLeftVisible ? "" : "hidden"}`}
                  style={{
                    display: isLeftVisible ? "block" : "none",
                  }}
                >
                  <img
                    src={blogDetail.blog.thumbnail}
                    alt={blogDetail.blog.title}
                    className="blog-thumbnail"
                  />
                  <div className="blog-description">
                    <h1 style={{ fontSize: "1.2em" }}>Description:</h1>
                    <p
                      className="p-font-size mb-4"
                      style={{
                        fontSize: "0.9em",
                        marginTop: "-5px",
                      }}
                    >
                      {blogDetail.blog.description}
                    </p>
                  </div>
                  <div className="blog-information">
                    <h1 style={{ fontSize: "1.2em" }}>Information:</h1>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.9em",
                        marginTop: "-5px",
                      }}
                    >
                      <tbody>
                        {Object.entries(blogDetail.blog.infos).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                  textTransform: "capitalize",
                                }}
                              >
                                {key.replace(/_/g, " ")}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {value}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Section */}
                <div className="blog-right">
                  <div
                    className="p-font-size mb-4"
                    style={{
                      fontSize: "0.9em",
                      marginTop: "-5px",
                    }}
                  >
                    <ReactMarkdown>{blogDetail.blog.article}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Show blog end*/}
        </div>

        {/* Comment start */}
        <div className="container-bg-comment px-3 col-12 py-5">
          <div className="comment-section mt-1">
            <div style={{ marginBottom: "-15px" }}>
              <p className="pt-3">
                <strong>Comments:</strong>
              </p>
            </div>
            {/* Chat comment big start */}
            <div className="comment-input">
              <textarea
                placeholder="Share your opinion"
                id="comment"
                className="mt-4"
                value={newComment}
                onChange={newCommentChange}
                onKeyDown={handleKeyDown}
              />
              <button className="send-opinion" onClick={addCommentHandler}>
                Send
              </button>
            </div>

            {/* Chat comment big end */}

            {/* Header comment start */}
            <div className="comment-tabs">
              <span>Newest Comments</span>
            </div>
            {/* Header comment end */}

            {/* List comment start */}
            <div>
              {comments.length > 0 ? (
                comments
                  .filter(
                    (comment) =>
                      comment.accountName && comment.accountName !== "Anonymous"
                  )
                  .map((comment, index) => (
                    <div className="comment-item col-12" key={index}>
                      <div>
                        <div className="comment-header col-12">
                          <img
                            className="comment-avatar"
                            src={
                              comment.profilePicture?.trim()
                                ? comment.profilePicture
                                : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                            }
                            alt="Avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                            }}
                          />
                          <span className="comment-user col-8 mt-1">
                            {comment.accountName}
                          </span>
                          <span className="comment-time col-3 mt-1 mx-2 d-flex justify-content-end">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="comment-info col-12 px-5">
                          {comment.comment ? comment.comment : "No content"}
                          {comment.accountName !== username &&
                          comment.status === "REPORTED" ? (
                            <p style={{ color: "red" }}>
                              This comment has been reported
                            </p>
                          ) : null}
                        </div>

                        <div className="d-flex">
                          <p
                            className="view-replies"
                            onClick={() => {
                              if (!commentVisibility[comment.id]) {
                                getReplies(id, comment.id);
                              }
                              toggleReplies(comment.id);
                            }}
                          >
                            {commentVisibility[comment.id]
                              ? `Hide replies (${
                                  (replies[comment.id] || []).filter(
                                    (reply) => reply.accountName
                                  ).length
                                })`
                              : `View replies`}
                          </p>

                          {/* Nút Reply */}
                          <p
                            className="view-replies"
                            onClick={() =>
                              setReplyingTo((prev) =>
                                prev === comment.id ? null : comment.id
                              )
                            }
                          >
                            Reply
                          </p>
                          {comment.accountName === username ? (
                            <AiFillDelete
                              className="icon-delete"
                              onClick={() => openModal(comment.id)}
                            />
                          ) : null}

                          {comment.accountName !== username &&
                          comment.status === "REPORTED" &&
                          comment.status === "DELETED" ? (
                            <AiFillFlag
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() => openReport(comment.id)}
                            />
                          ) : null}
                        </div>

                        {/* Ô nhập phản hồi */}
                        {replyingTo === comment.id && (
                          <div className="comment-input">
                            <textarea
                              placeholder="Share your opinion..."
                              className="mt-4"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={handleKeyDownReply}
                            />
                            <button
                              className="send-opinion"
                              onClick={addReplyHandler}
                            >
                              Send
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Hiển thị danh sách phản hồi reply */}
                      {commentVisibility[comment.id] &&
                        replies[comment.id]?.length > 0 && (
                          <div className="replies-list col-12 mx-5 mt-2">
                            {replies[comment.id]
                              .filter(
                                (reply) =>
                                  reply.accountName &&
                                  reply.accountName !== "Anonymous"
                              )
                              .map((reply, replyIndex) => (
                                <div
                                  className="reply-item"
                                  key={reply.id || replyIndex}
                                >
                                  <img
                                    className="comment-avatar"
                                    src={
                                      reply.profilePicture?.trim()
                                        ? reply.profilePicture
                                        : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                                    }
                                    alt="Avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                                    }}
                                  />
                                  <span className="reply-user-reply mx-3">
                                    {reply.accountName || ""}:
                                  </span>
                                  <span className="reply-time-reply">
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </span>
                                  <p className="reply-text-reply mx-5">
                                    {reply.comment || ""}
                                    {reply.accountName !== username &&
                                    reply.status === "REPORTED" ? (
                                      <p style={{ color: "red" }}>
                                        This comment has been reported
                                      </p>
                                    ) : null}
                                  </p>

                                  {/* Nút hiển thị/ẩn phản hồi */}
                                  <div className="d-flex">
                                    <p
                                      className="view-replies"
                                      onClick={() => {
                                        if (!commentVisibility[reply.id]) {
                                          getReplies(id, reply.id);
                                        }
                                        toggleReplies(reply.id);
                                      }}
                                    >
                                      {commentVisibility[reply.id]
                                        ? `Hide replies (${
                                            (replies[reply.id] || []).filter(
                                              (superReply) =>
                                                superReply.accountName
                                            ).length
                                          })`
                                        : `View replies`}
                                    </p>

                                    {/* Nút Reply cho reply */}
                                    <p
                                      className="view-replies"
                                      onClick={() =>
                                        setReplyingTo((prev) =>
                                          prev === reply.id ? null : reply.id
                                        )
                                      }
                                    >
                                      Reply
                                    </p>
                                    {reply.accountName === username ? (
                                      <AiFillDelete
                                        className="icon-delete-reply"
                                        onClick={() => openModalReply(reply.id)}
                                      />
                                    ) : null}

                                    {reply.accountName !== username &&
                                    reply.status === "REPORTED" &&
                                    comment.status === "DELETED" ? (
                                      <AiFillFlag
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          openReportReply(reply.id)
                                        }
                                      />
                                    ) : null}
                                  </div>
                                  {/* Ô nhập phản hồi cho reply */}
                                  {replyingTo === reply.id && (
                                    <div className="comment-input-reply">
                                      <textarea
                                        placeholder="Share your opinion..."
                                        value={replyText}
                                        className="mt-4"
                                        onChange={(e) =>
                                          setReplyText(e.target.value)
                                        }
                                        onKeyDown={handleKeyDownReply}
                                      />
                                      <button
                                        className="send-opinion"
                                        onClick={() =>
                                          addReplyHandler(reply.id)
                                        }
                                      >
                                        Send
                                      </button>
                                    </div>
                                  )}

                                  {/* Hiển thị danh sách phản hồi supper reply */}
                                  {commentVisibility[reply.id] &&
                                    replies[reply.id]?.length > 0 && (
                                      <div className="replies-list col-11 mx-5 mt-2">
                                        {replies[reply.id]
                                          .filter(
                                            (superReply) =>
                                              superReply.accountName &&
                                              superReply.accountName !==
                                                "Anonymous"
                                          )
                                          .map(
                                            (superReply, supperReplyIndex) => (
                                              <div
                                                className="reply-item"
                                                key={
                                                  superReply.id ||
                                                  supperReplyIndex
                                                }
                                              >
                                                <img
                                                  className="comment-avatar"
                                                  src={
                                                    superReply.profilePicture?.trim()
                                                      ? superReply.profilePicture
                                                      : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                                                  }
                                                  alt="Avatar"
                                                  onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                      "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                                                  }}
                                                />
                                                <span className="reply-user-reply mx-3">
                                                  {superReply.accountName || ""}
                                                  :
                                                </span>
                                                <span className="reply-time-reply">
                                                  {new Date(
                                                    superReply.timestamp
                                                  ).toLocaleString()}
                                                </span>
                                                <p className="reply-text-reply mx-5">
                                                  {superReply.comment ||
                                                    "No content"}
                                                </p>
                                                {superReply.accountName !==
                                                  username &&
                                                superReply.status ===
                                                  "REPORTED" ? (
                                                  <p style={{ color: "red" }}>
                                                    This comment has been
                                                    reported
                                                  </p>
                                                ) : null}

                                                {/* Nút hiển thị/ẩn phản hồi */}
                                                <div className="d-flex">
                                                  <p
                                                    className="view-replies"
                                                    onClick={() => {
                                                      if (
                                                        !commentVisibility[
                                                          superReply.id
                                                        ]
                                                      ) {
                                                        getReplies(
                                                          id,
                                                          superReply.id
                                                        );
                                                      }
                                                      toggleReplies(
                                                        superReply.id
                                                      );
                                                    }}
                                                  >
                                                    {commentVisibility[
                                                      superReply.id
                                                    ]
                                                      ? `Hide replies (${
                                                          (
                                                            replies[
                                                              superReply.id
                                                            ] || []
                                                          ).filter(
                                                            (superReplySmall) =>
                                                              superReplySmall.accountName
                                                          ).length
                                                        })`
                                                      : `View replies`}
                                                  </p>

                                                  {/* Nút Reply cho reply */}
                                                  <p
                                                    className="view-replies"
                                                    onClick={() =>
                                                      setReplyingTo((prev) =>
                                                        prev === superReply.id
                                                          ? null
                                                          : superReply.id
                                                      )
                                                    }
                                                  >
                                                    Reply
                                                  </p>
                                                  {superReply.accountName ===
                                                  username ? (
                                                    <AiFillDelete
                                                      className="icon-delete-reply"
                                                      onClick={() =>
                                                        openModalReply(
                                                          superReply.id
                                                        )
                                                      }
                                                    />
                                                  ) : null}

                                                  {superReply.accountName !==
                                                    username &&
                                                  reply.status === "REPORTED" &&
                                                  comment.status ===
                                                    "DELETED" ? (
                                                    <AiFillFlag
                                                      style={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        openReportReply(
                                                          superReply.id
                                                        )
                                                      }
                                                    />
                                                  ) : null}
                                                </div>

                                                {/* Ô nhập phản hồi cho reply */}
                                                {replyingTo ===
                                                  superReply.id && (
                                                  <div className="comment-input-reply">
                                                    <textarea
                                                      placeholder="Share your opinion..."
                                                      value={replyText}
                                                      className="mt-4"
                                                      onChange={(e) =>
                                                        setReplyText(
                                                          e.target.value
                                                        )
                                                      }
                                                      onKeyDown={
                                                        handleKeyDownReply
                                                      }
                                                    />
                                                    <button
                                                      className="btn btn-success"
                                                      onClick={() =>
                                                        addReplyHandler(
                                                          superReply.id
                                                        )
                                                      }
                                                    >
                                                      Send
                                                    </button>
                                                  </div>
                                                )}

                                                {/* Hiển thị danh sách phản hồi supper supper reply */}
                                                {commentVisibility[
                                                  superReply.id
                                                ] &&
                                                  replies[superReply.id] &&
                                                  replies[superReply.id]
                                                    .length > 0 && (
                                                    <div className="replies-list col-11 mx-5 mt-2">
                                                      {replies[superReply.id]
                                                        .filter(
                                                          (superReplySmall) =>
                                                            superReplySmall.accountName &&
                                                            superReplySmall.accountName !==
                                                              "Anonymous"
                                                        )
                                                        .map(
                                                          (
                                                            superReplySmall,
                                                            index
                                                          ) => (
                                                            <div
                                                              className="reply-item"
                                                              key={
                                                                superReplySmall.id ||
                                                                index
                                                              }
                                                            >
                                                              <img
                                                                className="comment-avatar"
                                                                src={
                                                                  superReplySmall.profilePicture?.trim()
                                                                    ? superReplySmall.profilePicture
                                                                    : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                                                                }
                                                                alt="Avatar"
                                                                onError={(
                                                                  e
                                                                ) => {
                                                                  e.target.onerror =
                                                                    null;
                                                                  e.target.src =
                                                                    "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
                                                                }}
                                                              />
                                                              <span className="reply-user-reply mx-3">
                                                                {superReplySmall.accountName ||
                                                                  ""}
                                                              </span>
                                                              <span className="reply-time-reply">
                                                                {new Date(
                                                                  superReplySmall.timestamp
                                                                ).toLocaleString()}
                                                              </span>
                                                              <p className="reply-text-reply d-flex">
                                                                <p
                                                                  style={{
                                                                    marginLeft:
                                                                      "0.5em",
                                                                    marginRight:
                                                                      "1em",
                                                                  }}
                                                                >
                                                                  {superReplySmall.comment ||
                                                                    "No content"}
                                                                </p>
                                                                {superReplySmall.accountName !==
                                                                  username &&
                                                                superReplySmall.status ===
                                                                  "REPORTED" ? (
                                                                  <p
                                                                    style={{
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                  >
                                                                    This comment
                                                                    has been
                                                                    reported
                                                                  </p>
                                                                ) : null}
                                                                {/* Nút Reply cho reply */}
                                                                {superReplySmall.accountName ===
                                                                username ? (
                                                                  <AiFillDelete
                                                                    style={{
                                                                      width:
                                                                        "10%",
                                                                    }}
                                                                    className="icon-delete-reply ms-auto"
                                                                    onClick={() =>
                                                                      openModalReply(
                                                                        superReplySmall.id
                                                                      )
                                                                    }
                                                                  />
                                                                ) : null}

                                                                {superReplySmall.accountName !==
                                                                  username &&
                                                                reply.status ===
                                                                  "REPORTED" &&
                                                                comment.status ===
                                                                  "DELETED" ? (
                                                                  <AiFillFlag
                                                                    style={{
                                                                      color:
                                                                        "red",
                                                                      cursor:
                                                                        "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                      openReportReply(
                                                                        superReplySmall.id
                                                                      )
                                                                    }
                                                                  />
                                                                ) : null}
                                                              </p>
                                                            </div>
                                                          )
                                                        )}
                                                    </div>
                                                  )}
                                              </div>
                                            )
                                          )}
                                      </div>
                                    )}
                                </div>
                              ))}
                          </div>
                        )}
                    </div>
                  ))
              ) : (
                <p>No comments</p>
              )}
            </div>
            <div
              style={{ marginLeft: "55px" }}
              className="pagination-container-card mt-4"
            >
              <Pagination className="custom-pagination-card">
                <Pagination.Prev
                  onClick={() => handlePageChange(pageBlog - 1)}
                  disabled={pageBlog === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === pageBlog}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(pageBlog + 1)}
                  disabled={pageBlog === totalPages}
                />
              </Pagination>
            </div>

            {/* Popup delete reply start */}
            {popupDeleteReply &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.5)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: 999,
                    }}
                    onClick={cancelDeleteReply}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "2em",
                      width: "70%",
                      maxWidth: "400px",
                      minWidth: "280px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: 1000,
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "1em",
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "1.25em",
                      }}
                    >
                      Confirm Delete Comment
                    </h3>
                    <p
                      style={{
                        marginTop: "-0.5em",
                        color: "#555",
                        fontSize: "0.95em",
                      }}
                    >
                      Are you sure you want to delete this comment?
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.75em",
                        marginTop: "1.5em",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => deleteReply(selectedIdReply)}
                        style={{
                          flex: "1 1 45%",
                          padding: "0.75em",
                          backgroundColor: "#d32f2f",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.95em",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#c62828")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#d32f2f")
                        }
                      >
                        Yes
                      </button>
                      <button
                        onClick={cancelDeleteReply}
                        style={{
                          flex: "1 1 45%",
                          padding: "0.75em",
                          backgroundColor: "#1976d2",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.95em",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#1565c0")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#1976d2")
                        }
                      >
                        No
                      </button>
                    </div>

                    <IoCloseSharp
                      className="ic-close"
                      onClick={cancelDeleteReply}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        color: "#555",
                        fontSize: "1.2em",
                      }}
                    />
                  </div>
                </>,
                document.body
              )}

            {/* Popup delete reply success start */}
            {popupDeleteReplySuccess &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.5)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: "999",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: "1000",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        padding: "10px",
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "1.15em",
                      }}
                    >
                      ✅ Comment deleted successfully
                    </h3>
                  </div>
                </>,
                document.body
              )}

            {/* Popup delete start */}
            {popupDelete &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      backdropFilter: "blur(0.05em)",
                      WebkitBackdropFilter: "blur(6px)",
                      zIndex: 999,
                    }}
                    onClick={cancelDelete}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: 1000,
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
                      Are you sure you want to delete this comment?
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
                        onClick={() => deleteBlog(selectedId)}
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
                        Yes
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
                        No
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
                </>,
                document.body
              )}

            {/* Popup delete success start */}
            {popupDeleteSuccess &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.5)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: "999",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: "1000",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        padding: "10px",
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "1.15em",
                      }}
                    >
                      ✅ Comment deleted successfully
                    </h3>
                  </div>
                </>,
                document.body
              )}

            {/* Popup report reply start */}
            {popupReportReply &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.5)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: "999",
                    }}
                    onClick={cancelReportReply}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: "1000",
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
                      Confirm Report Comment
                    </h3>
                    <p
                      style={{
                        marginTop: "-10px",
                        color: "#555",
                        fontSize: "0.9em",
                      }}
                    >
                      Are you sure you want to report this comment?
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
                        onClick={() => reportReply(selectedIdReportReply)}
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
                        Yes
                      </button>
                      <button
                        onClick={cancelReportReply}
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
                        No
                      </button>
                    </div>
                    {}
                    <IoCloseSharp
                      className="ic-close"
                      onClick={cancelReportReply}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    />
                  </div>
                </>,
                document.body
              )}

            {/* Popup report reply success start */}
            {popupReportReplySuccess &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.5)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: "999",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: "1000",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        padding: "10px",
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "1.15em",
                      }}
                    >
                      ✅ Comment reported successfully
                    </h3>
                  </div>
                </>,
                document.body
              )}

            {/* Popup report start */}
            {popupReport &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      backdropFilter: "blur(0.05em)",
                      WebkitBackdropFilter: "blur(6px)",
                      zIndex: 999,
                    }}
                    onClick={cancelReport}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: 1000,
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
                      Confirm Report Comment
                    </h3>
                    <p
                      style={{
                        marginTop: "-10px",
                        color: "#555",
                        fontSize: "0.9em",
                      }}
                    >
                      Are you sure you want to report this comment?
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
                        onClick={() => reportComment(selectedIdReport)}
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
                        Yes
                      </button>
                      <button
                        onClick={cancelReport}
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
                        No
                      </button>
                    </div>
                    <IoCloseSharp
                      className="ic-close"
                      onClick={cancelReport}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    />
                  </div>
                </>,
                document.body
              )}

            {/* Popup report success start */}
            {popupReportSuccess &&
              ReactDOM.createPortal(
                <>
                  <div
                    style={{
                      position: "fixed",
                      top: "0",
                      left: "0",
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(87, 87, 87, 0.5)",
                      backdropFilter: "blur(0.05em)",
                      zIndex: "999",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "25px",
                      width: "80%",
                      maxWidth: "400px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: "1000",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      style={{
                        padding: "10px",
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "1.15em",
                      }}
                    >
                      ✅ Comment reported successfully
                    </h3>
                  </div>
                </>,
                document.body
              )}
          </div>
        </div>
        {/* Comment end */}
      </div>
    </div>
  );
};
export default BlogDetail;
