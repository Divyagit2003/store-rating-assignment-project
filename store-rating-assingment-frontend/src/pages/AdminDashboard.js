import React, { useEffect, useState } from "react";
import api from "../api/api";

function AdminDashboard() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "User",
  });
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchStore, setSearchStore] = useState("");

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Error loading stats", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get("/admin/stores");
      setStores(res.data);
    } catch (err) {
      console.error("Error loading stores", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name ?? "").toLowerCase().includes((searchUser ?? "").toLowerCase()) ||
      (u.email ?? "")
        .toLowerCase()
        .includes((searchUser ?? "").toLowerCase()) ||
      (u.address ?? "")
        .toLowerCase()
        .includes((searchUser ?? "").toLowerCase()) ||
      (u.role ?? "").toLowerCase().includes((searchUser ?? "").toLowerCase())
  );

  const filteredStores = stores.filter(
    (s) =>
      (s.name ?? "")
        .toLowerCase()
        .includes((searchStore ?? "").toLowerCase()) ||
      (s.address ?? "")
        .toLowerCase()
        .includes((searchStore ?? "").toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Welcome, Admin</h2>

      <div className="row mt-4 mb-3">
        <div className="col-md-4">
          <div className="card text-bg-primary">
            <div className="card-body">
              <h5>Total Users</h5>
              <p className="display-6">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-bg-success">
            <div className="card-body">
              <h5>Total Stores</h5>
              <p className="display-6">{stats.totalStores}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-bg-warning">
            <div className="card-body">
              <h5>Total Ratings</h5>
              <p className="display-6">{stats.totalRatings}</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-5">Add New User</h4>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api.post("/users/registerUser", {
              name: newUser.name,
              email: newUser.email,
              password: newUser.password,
              address: newUser.address,
              role: newUser.role,
            });
            alert("User added successfully!");
            setNewUser({
              name: "",
              email: "",
              password: "",
              address: "",
              role: "User",
            });
            fetchUsers(); // refresh
          } catch (err) {
            alert("Failed to add user.");
          }
        }}
        className="mb-4 row g-3"
      >
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={newUser.address}
            onChange={(e) =>
              setNewUser({ ...newUser, address: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-1">
          <select
            className="form-select"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Owner">Owner</option>
          </select>
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-success w-100">
            Add
          </button>
        </div>
      </form>

      {/* Users Section */}
      <h4 className="mt-5">All Users</h4>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search by name, email, address, or role"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>
                {user.role}
                {user.role === "Owner" && (
                  <span>
                    {" "}
                    (Rating:{" "}
                    {user.averageRating !== undefined &&
                    user.averageRating !== null
                      ? user.averageRating.toFixed(1)
                      : "N/A"}
                    )
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mt-5">Add New Store</h4>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api.post("/stores/add", newStore);
            alert("Store added!");
            setNewStore({ name: "", email: "", address: "" });
            fetchStores();
          } catch (err) {
            alert("Failed to add store.");
          }
        }}
        className="mb-4 row g-3"
      >
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Store Name"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="email"
            className="form-control"
            placeholder="Store Email"
            value={newStore.email}
            onChange={(e) =>
              setNewStore({ ...newStore, email: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={newStore.address}
            onChange={(e) =>
              setNewStore({ ...newStore, address: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">
            Add Store
          </button>
        </div>
      </form>

      {/* Stores Section */}
      <h4 className="mt-5">All Stores</h4>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search store by name or address"
        value={searchStore}
        onChange={(e) => setSearchStore(e.target.value)}
      />

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Store Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>
                {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
