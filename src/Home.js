import React from "react";
import "./Home.css"; // Import the CSS file

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to DevTasker</h1>
      <p>Manage your tasks efficiently and stay productive!</p>
      <button className="home-button">Get Started</button>
    </div>
  );
}
