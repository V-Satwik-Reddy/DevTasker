import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addTask.css";
import { faker } from "@faker-js/faker";

const API_URL = "http://localhost:5000/tasks/createTask";

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

    // ✅ Separate function to bulk-generate tasks
    const bulkGenerateTasks = async (count = 1000) => {
        for (let i = 0; i < count; i++) {
            try {
                const taskData = {
                    title: faker.lorem.words(3),
                    description: faker.lorem.sentence(),
                    dueDate: faker.date.soon({ days: 30 }).toISOString().split("T")[0],
                    status: faker.helpers.arrayElement(["Pending", "In Progress", "Completed"]),
                    priority: faker.helpers.arrayElement(["Critical", "High", "Medium", "Low"]),
                };

                const response = await fetch(API_URL, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData),
                });

                if (response.ok) {
                    console.log(`✅ Task ${i + 1} added successfully`);
                } else {
                    console.error(`❌ Task ${i + 1} failed: ${(await response.json()).message}`);
                }
            } catch (error) {
                console.error(`Error adding task ${i + 1}:`, error);
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

            <button onClick={() => bulkGenerateTasks(1000)}>Generate 1000 Tasks</button>
        </div>
    );
};

export default AddTask;
