import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Admin Panel</h2>

        <button onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/admin/addproduct")}>
          Add Product
        </button>

         <button onClick={() => navigate("/admin/ProductList")}>
          Product List
        </button>


        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        <h1>Welcome, {user?.username || "Admin"} 👋</h1>

        {/* STATS CARDS */}
        <div className="cards">

          <div className="card">
            <h3>Total Users</h3>
            <p>120</p>
          </div>

          <div className="card">
            <h3>Total Products</h3>
            <p>45</p>
          </div>

          <div className="card">
            <h3>Orders</h3>
            <p>18</p>
          </div>

        </div>

      </div>

    </div>
  );
}