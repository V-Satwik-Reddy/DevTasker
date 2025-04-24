import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskDetails.css";
import Loader from './loader.js';
const TaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`https://devtaskerb.up.railway.app/tasks/task/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch task");

        const data = await res.json();
        setTask(data);
        setStatus(data.status);
        setPriority(data.priority);
        setDueDate(data.dueDate.split("T")[0]);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://devtaskerb.up.railway.app/tasks/updateTask/${id}`,
        { status, priority, dueDate },
        { withCredentials: true }
      );
      alert("Task updated successfully!");
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://devtaskerb.up.railway.app/tasks/deleteTask/${id}`, {
        withCredentials: true,
      });
      alert("Task deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`https://devtaskerb.up.railway.app/tasks/task/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  if (!task) return <p><Loader/></p>;

  return (
    <div className="task-details-container">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
      <label>
        Priority:
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>
      <label>
        Due Date:
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </label>

      <div className="grid2">
        <button onClick={handleUpdate}>Update Task</button>
        <button onClick={handleDelete} className="delete-btn">Delete Task</button>
      </div>

      <h3>Upload Completion File:</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default TaskDetails;
