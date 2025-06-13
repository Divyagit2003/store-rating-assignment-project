import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await api.post("/users/loginUser", form);
    const data = response.data;

    if (data && data.role) {
      // ✅ Save everything
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);

      // ✅ Route by role
      if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "User") {
        navigate("/user/dashboard");
      } else if (data.role === "Owner") {
        navigate("/owner/dashboard");
      } else {
        setError("Unknown role.");
      }
    } else {
      setError("Invalid email or password.");
    }
  } catch (err) {
    console.error("Login error", err);
    setError("Login failed. Please try again.");
  }
};


  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="col-md-6 mt-4">
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;
