import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MessageBoard.css";

function MessageBoard({ user, setUser }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/messages")
      .then(res => res.json())
      .then(data => setMessages(data.messages))
      .catch(err => console.error("Error fetching messages:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await fetch("http://localhost:5001/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user: user.username,
          message
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages([...messages, { username: user.username, message }]);
        setMessage("");
        setStatus("Message posted!");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error sending message");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5001/log-out", { credentials: "include" });
    setUser(null);
    navigate("/");
  };

  return (
    <div className="board-container">
      {/* Header */}
      <div className="board-header">
        <h1 className="board-title">
          Welcome, <span className="board-username">{user.username}</span>!
        </h1>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      {/* Post Form */}
      <div className="post-form-container">
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            className="post-textarea"
            placeholder="Share your thoughts with the community..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="post-button">
            Post Message
          </button>
        </form>
        {status && <p className="status-message">{status}</p>}
      </div>

      {/* Messages */}
      <div className="messages-container">
        <h2 className="messages-title">Community Messages</h2>
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Be the first to post!</p>
        ) : (
          <ul className="messages-list">
            {messages.map((m, i) => (
              <li key={i} className="message-item">
                <span className="message-author">{m.username}</span>
                <p className="message-text">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MessageBoard;