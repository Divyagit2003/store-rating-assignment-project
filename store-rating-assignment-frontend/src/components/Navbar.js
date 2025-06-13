
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const logout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Store Rating</Link>
      <div className="ms-auto">
        {role ? (
          <button className="btn btn-light" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link className="btn btn-light mx-2" to="/">Login</Link>
            <Link className="btn btn-primary" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
