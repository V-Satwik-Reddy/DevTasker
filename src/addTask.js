import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addTask.css";

const AddTask = () => {
    const navigate = useNavigate();
    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        status: "Pending",
    });

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/tasks/createTask", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            if (response.ok) {
                navigate("/dashboard");
            } else {
                const data = await response.json(); 
                if (data.message === "Due date must be in the future") {
                    alert("Due date must be in the future");
                    return;
                }
            }
             console.error("Failed to add task");
            
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div className="add-task-container">
            <h2>Add a New Task</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={task.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={task.description} onChange={handleChange} required />
                <select name="priority" value={task.priority} onChange={handleChange}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} required />
                <select name="status" value={task.status} onChange={handleChange}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
