import { useState, useEffect } from "react";

function MessageBoard({ user }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/messages")
        .then(res => res.json())
        .then(data => setMessages(data.messages));
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
        // Add new message to UI after DB success
        setMessages([...messages, { username: user.username, message }]);
        setMessage("");
        setStatus("Message posted!");
      } else {
        setStatus("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error sending message");
    }
  };

  return (
    <div>
      <h1>Welcome {user.username}</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your message here..."
          rows="4"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <br />
        <button type="submit">Post New Message</button>
      </form>

      <h3>Messages:</h3>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            <strong>{m.username}: </strong>
            {m.message}
          </li>
        ))}
      </ul>

      {status && <p>{status}</p>}

      <a href="/">LOG OUT</a>
    </div>
  );
}

export default MessageBoard;
