import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "User", // matches backend enum: Admin, User, Owner
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (form.name.length < 20 || form.name.length > 60)
      err.name = "Name must be between 20 and 60 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) err.email = "Invalid email format.";

    const passRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
    if (!passRegex.test(form.password))
      err.password = "Password must be 8-16 characters, include 1 uppercase and 1 special character.";

    if (form.address.length > 400)
      err.address = "Address must be under 400 characters.";

    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post("/users/registerUser", form);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="col-md-6 mt-4">
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <small className="text-danger">{errors.name}</small>}
        </div>

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
          {errors.email && <small className="text-danger">{errors.email}</small>}
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
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        <div className="form-group mb-3">
          <label>Address</label>
          <textarea
            name="address"
            className="form-control"
            value={form.address}
            onChange={handleChange}
            required
          ></textarea>
          {errors.address && <small className="text-danger">{errors.address}</small>}
        </div>

        <div className="form-group mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
          >
            <option value="User">Normal User</option>
            <option value="Owner">Store Owner</option>
            <option value="Admin">System Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
