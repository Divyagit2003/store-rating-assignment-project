import React, { useEffect, useState } from "react";
import axios from "axios";

const StoreOwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [avgRating, setAvgRating] = useState(null);
  const [error, setError] = useState("");

  const ownerEmail = localStorage.getItem("userEmail");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    console.log("Email from localStorage:", ownerEmail);
    console.log("Role from localStorage:", role);

    if (!ownerEmail || role !== "Owner") {
      setError("Store owner not logged in.");
      return;
    }

    const fetchOwnerStoreRatings = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/stores/ownerRatings", {
          params: { ownerEmail },
        });

        setStoreName(response.data.storeName);
        setAvgRating(response.data.averageRating);
        setRatings(response.data.ratings);
      } catch (err) {
        console.error("Failed to load store ratings", err);
        setError("Could not load ratings. Check if your store is assigned correctly.");
      }
    };

    fetchOwnerStoreRatings();
  }, [ownerEmail, role]);

  return (
    <div className="container mt-4">
      <h2>Welcome, Store Owner</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {!error && (
        <>
          <h4>Store: {storeName}</h4>
          <p>
            <strong>Average Rating:</strong>{" "}
            {avgRating !== null ? avgRating.toFixed(2) : "No ratings yet"}
          </p>

          <h5 className="mt-4">User Ratings:</h5>
          {ratings.length === 0 ? (
            <p>No ratings submitted yet.</p>
          ) : (
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>User Name</th>
                  <th>Comment</th>
                  <th>Stars</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.userName}</td>
                    <td>{rating.comment || "No comment"}</td>
                    <td>{rating.stars}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
