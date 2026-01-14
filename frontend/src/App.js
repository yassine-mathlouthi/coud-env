import { useEffect, useState, useCallback } from "react";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://98.91.199.191:8000";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const url = editingId 
        ? `${API_BASE_URL}/users/${editingId}`
        : `${API_BASE_URL}/users`;
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() })
      });

      if (!response.ok) {
        throw new Error(editingId ? "Failed to update user" : "Failed to add user");
      }

      setName("");
      setEmail("");
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError(err.message);
      console.error("Error saving user:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await loadUsers();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting user:", err);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setError(null);
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-logo">CloudApp</h1>
          <ul className="navbar-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#users">Users</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>
      </nav>

      <div className="app-content">
        <h1 className="app-title">{editingId ? "Edit User" : "Cloud User App"}</h1>

        <form onSubmit={addUser} className="user-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="form-input"
              aria-label="User name"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="form-input"
              aria-label="User email"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update User" : "Add User")}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <section className="users-section">
          <h2 className="section-title">Users</h2>
          
          {loading && users.length === 0 ? (
            <p className="loading-text">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="empty-text">No users yet. Add one above!</p>
          ) : (
            <ul className="users-list">
              {users.map((user) => (
                <li key={user.id} className="user-item">
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="user-actions">
                    <button 
                      onClick={() => startEdit(user)}
                      className="btn-edit"
                      title="Edit user"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="btn-delete"
                      title="Delete user"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} CloudApp. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;