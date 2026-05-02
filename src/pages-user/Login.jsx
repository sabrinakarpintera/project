import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/Signup.css"; 
import logoImage from "../assets/fuku-logo.png";
import bgImage from "../assets/fuku-bg.png";  

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return;

  try {
    const user = JSON.parse(storedUser);

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (error) {
    console.warn("Invalid user data in localStorage. Clearing...", error);
    localStorage.removeItem("user"); 
  }

}, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost/Fuku/src/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify(form)
      });

      const data = await response.json();
      console.log(data);

      if (data.message === "Login successful") {

        const userData = {
          username: form.username,
          role: data.role || "user" 
        };

        localStorage.clear();

        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }

      } else {
        setMessage(data.message);
      }

    } catch (error) {
      console.error(error);
      setMessage("Server error. Try again.");
    }

    setLoading(false);
  };

  return (

    <div className="signBody">

      <div className="container1">

        <div className="logo1">
          <img src={logoImage} alt="Fuku Logo" />
        </div>

        <form onSubmit={handleSubmit}>

          <h2>Welcome back!</h2>
          <h4>Please login to your account.</h4>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {message && <p className="error">{message}</p>}

          <button type="submit" className="register" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <p>
            No account? 
            <button 
              type="button" 
              className="login" 
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>

        </form>

      </div>

      <div className="bg">
        <img src={bgImage} alt="Shopping Background" className="bg-illustration"/>
      </div>

    </div>
  );
}