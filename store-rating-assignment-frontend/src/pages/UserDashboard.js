import React, { useEffect, useState } from "react";
import api from "../api/api";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [userEmail, setUserEmail] = useState(""); // you can also store in localStorage if needed

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail")); // set during login
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores/allStores"); // Backend endpoint for all stores
      setStores(res.data);
    } catch (err) {
      console.error("Failed to load stores", err);
    }
  };

  const handleRating = async (storeId, ratingValue) => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ fetch saved userId

      if (!userId) {
        alert("User not logged in.");
        return;
      }

      await api.post("/ratings/submit", {
        userId: parseInt(userId), // backend likely expects number
        storeId: storeId,
        stars: ratingValue,
        comment: "Rated via dashboard",
      });

      alert("Rating submitted!");
      fetchStores(); // refresh store list to update average
    } catch (err) {
      alert("Failed to submit rating");
      console.error(err);
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Welcome, {localStorage.getItem("userName")}</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search store by name or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredStores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        filteredStores.map((store) => (
          <div className="card mb-3" key={store.id}>
            <div className="card-body">
              <h5 className="card-title">{store.name}</h5>
              <p className="card-text">
                <strong>Address:</strong> {store.address}
              </p>
              <p className="card-text">
                <strong>Average Rating:</strong>{" "}
                {store.averageRating
                  ? store.averageRating.toFixed(1)
                  : "No ratings yet"}
              </p>

              <div>
                <label>Submit/Update your rating: </label>{" "}
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="btn btn-sm btn-outline-primary mx-1"
                    onClick={() => handleRating(store.id, star)}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDashboard;
