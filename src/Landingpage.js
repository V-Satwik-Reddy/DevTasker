import { FaCheckCircle } from "react-icons/fa";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <h1 className="landing-title">Manage Your Tasks Efficiently</h1>
      <p className="landing-description">
        DevTasker helps you organize your work with priorities, deadlines, and
        real-time tracking. Stay productive and never miss a task again!
      </p>
      <div className="features">
        <div className="feature-item">
          <FaCheckCircle className="icon" />
          <span>Task Management</span>
        </div>
        <div className="feature-item">
          <FaCheckCircle className="icon" />
          <span>Priority & Deadlines</span>
        </div>
        <div className="feature-item">
          <FaCheckCircle className="icon" />
          <span>Secure Authentication</span>
        </div>
      </div><button className="get-started-btn" onClick={() => navigate("/dashboard")}>
            Get Started
        </button>
    </div>
  );
}