function MessageBoard({ user }) {
  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <p>This is the protected message board.</p>
    </div>
  );
}

export default MessageBoard;
