import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import TaskCard from "./components/TaskCard";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState(""); // State for filtering

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/verify", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                    fetchTasks();
                } else {
                    navigate("/Auth");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                navigate("/Auth");
            }
        };
        checkAuth();
    }, [navigate]);

    const fetchTasks = async (status = "") => {
        try {
            const taskdata = await fetch(`http://localhost:5000/tasks/getTasks?status=${status}`, {
                method: "GET",
                credentials: "include",
            });
            const task = await taskdata.json();
            setTasks(task.tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);
        fetchTasks(selectedStatus); // Fetch tasks based on selected status
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Welcome to the Dashboard, {user?.user.username}!</h2>

            {/* Status Filter Dropdown */}
            <div className="filter-container">
                <label>Filter by Status:</label>
                <select value={statusFilter} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="task-grid">
                {tasks.length > 0 ? (
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
