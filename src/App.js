import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const loadUsers = () => {
    fetch(API + "/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const addUser = () => {
    fetch(API + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    }).then(() => {
      setName("");
      setEmail("");
      loadUsers();
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Cloud User App</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={addUser}>Add</button>

      <h3>Users</h3>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
