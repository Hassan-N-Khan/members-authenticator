import { Routes, Route } from "react-router-dom";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import MessageBoard from "../components/MessageBoard";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/session", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        console.log("SESSION RESPONSE:", data); // <--- ADD THIS
        if (data.loggedIn) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("SESSION ERROR:", err);
        setLoading(false);
      });
  }, []);



  return (
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />

        <Route
          path="/message-board"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <MessageBoard user={user} />
            </ProtectedRoute>
          }
        />


        <Route path="/" element={<Login setUser={setUser} />} />

      </Routes>
  );
}

export default App;
