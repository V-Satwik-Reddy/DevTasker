//dashboard
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

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
                    console.log("User data:", data);
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

    const handleLogout = async () => {
        await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            credentials: "include", // Ensure cookies are sent
        });

        navigate("/");
    };


    return (
        <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to the Dashboard, {user?.user.username}!</h2>
      <div className="task-grid">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {task.status}</p>
            </div>
          ))
        ) : (
          <p className="no-tasks">No tasks available</p>
        )}
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <button className="add-task-btn" onClick={() => navigate("/add-task")}>+</button>
    </div>
    );
    
};

export default Dashboard;
