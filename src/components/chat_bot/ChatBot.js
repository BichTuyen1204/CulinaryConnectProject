import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Handles sending user messages
  const handleSend = () => {
    if (input.trim() && !isTyping) {
      setIsTyping(true);

      const newMessages = [...messages, { text: input, sender: "user" }];
      setMessages(newMessages);
      setInput("");

      // Placeholder for WebSocket bot message sending
        // ------------------------------------
      setTimeout(() => {
        setMessages([...newMessages, { text: "Hi!", sender: "bot" }]);
        setIsTyping(false);
        textareaRef.current?.focus();
      }, 1000);
       // ------------------------------------
    }
  };

  // Auto-scroll when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter and Shift + Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setInput((prev) => prev + "\n");
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="chat-container">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
      {isOpen && (
        <div className="chat-bot">
          <div className="chat-header">
            <span>Chat with Us</span>
            <button className="close-chat" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <textarea
              ref={textareaRef}
              placeholder={isTyping ? "Bot is typing..." : "Type a message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="chat-textarea"
            />
            <button
              onClick={handleSend}
              disabled={isTyping}
              className={isTyping ? "disabled-btn" : ""}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
