import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addTask.css";
import { faker } from "@faker-js/faker";

const API_URL = "https://devtaskerb.up.railway.app/tasks/createTask";

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
            const response = await fetch(API_URL, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });

            if (response.ok) {
                navigate("/dashboard");
            } else {
                const data = await response.json();
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const bulkGenerateTasks = async (count = 100, batchSize = 100) => {
        let tasks = [];
    
        for (let i = 0; i < count; i++) {
            tasks.push({
                title: faker.lorem.words(3),
                description: faker.lorem.sentence(),
                dueDate: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
                status: faker.helpers.arrayElement(["Pending", "In Progress", "Completed"]),
                priority: faker.helpers.arrayElement(["Critical", "High", "Medium", "Low"]),
            });
    
            if (tasks.length === batchSize || i === count - 1) {
                try {
                    const response = await fetch("https://devtaskerb.up.railway.app/tasks/bulkCreateTasks", {
                        method: "POST",
                        credentials: "include", // Sends cookies for authentication
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tasks }),
                    });
    
                    if (response.ok) {
                        console.log(`✅ ${tasks.length} tasks added successfully`);
                    } else {
                        console.error(`❌ Failed: ${(await response.json()).message}`);
                    }
                } catch (error) {
                    console.error("Error adding tasks:", error);
                }
    
                tasks = []; // Clear array for next batch
            }
        }
    };
    
    

    return (
        <div className="add-task-container">
            <h2>Add a New Task</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" value={task.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={task.description} onChange={handleChange} required />
                <select name="priority" value={task.priority} onChange={handleChange}>
                    <option value="Critical">Critical</option>
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

            <button onClick={() => bulkGenerateTasks(100)}>Generate 100 Tasks</button>
        </div>
    );
};

export default AddTask;
