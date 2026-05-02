import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/Signup.css";
import logoImage from "../assets/fuku-logo.png";
import bgImage from "../assets/fuku-bg.png";

export default function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const response = await fetch("http://localhost/Fuku/src/api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setMessage(data.message);

    if (data.message === "User registered successfully") {
      navigate("/");
    }
  };

  return (

    <div className="signBody">

      <div className="container1">

      <div className="logo1">
        <img src={logoImage} alt="Fuku Logo" />
      </div>

      <form onSubmit={handleSubmit}>

        <h2>Hello, Welcome!</h2>
        <h4>Create an account.</h4>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <p className="error">{message}</p>

        <button type="submit" className="register">Sign Up</button>

        <p>
          Already have an account? 
          <button type="button" className="login" onClick={() => navigate("/")}>
            Login
          </button>
        </p>

      </form>

    </div>
   
    <div className="bg">
      <img src={bgImage} alt="Man & Woman Shopping" className="bg-illustration" />
  </div>

    </div>

    
  );
}