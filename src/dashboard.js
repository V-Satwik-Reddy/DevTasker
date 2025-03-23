import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import TaskCard from "./components/TaskCard";

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("desc"); // Default to descending

    useEffect(() => {
        if (!user) navigate("/auth");  
        else fetchTasks();
    }, [user, navigate]);

    const fetchTasks = async (status = "", sort = "desc") => {
        try {
            const taskdata = await fetch(`https://devtaskerb.up.railway.app/tasks/getTasks?status=${status}`, {
                method: "GET",
                credentials: "include",
            });
            const task = await taskdata.json();
            let sortedTasks = task.tasks.sort((a, b) => {
                return sort === "asc"
                    ? new Date(a.dueDate) - new Date(b.dueDate)
                    : new Date(b.dueDate) - new Date(a.dueDate);
            });
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);
        fetchTasks(selectedStatus, sortOrder);
    };

    const handleSortChange = (e) => {
        const selectedSort = e.target.value;
        setSortOrder(selectedSort);
        fetchTasks(statusFilter, selectedSort);
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Welcome to the Dashboard, {user?.user.username}!</h2>

            {/* Filter & Sort Container */}
            
            <div class="parent">
                <div class="div2"><label>Filter by Status:</label>
                    <select value={statusFilter} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="div4"><label>Sort by Due Date:</label>
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
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
