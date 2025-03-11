//dashboard
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import TaskCard from "./components/TaskCard";
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/verify", {
                    method: "GET",
                    credentials: "include", // Send cookies with request
                });
                const data = await response.json();
                if (response.ok) {
                    const taskdata = await fetch("http://localhost:5000/tasks/getTasks", {
                        method: "GET",
                        credentials: "include", 
                    });
                    const task = await taskdata.json();
                    setTasks(task.tasks);
                    setUser(data);
                } else {
                    navigate("/Auth");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                navigate("/Auth");
            } finally {
                console.log("Auth check completed");
            }
        };

        checkAuth();
    }, [navigate]);



    return (
        <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to the Dashboard, {user?.user.username}!</h2>
      <div className="task-grid">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
      <button className="add-task-btn" onClick={() => navigate("/add-task")}>+</button>
    </div>
    );
    
};

export default Dashboard;
