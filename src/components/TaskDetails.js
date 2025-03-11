import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TaskDetails.css";
const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://localhost:5000/tasks/task/${id}`, {
            method: "GET",
            credentials: "include", // Send cookies with request
        });

        if (!res.ok) throw new Error("Failed to fetch task");
        if(!res.ok){
            const taskdata = res.json();
            console.log(taskdata);
        }
        const data = await res.json();
        setTask(data);
        setStatus(data.status);
        setPriority(data.priority);
        setDueDate(data.dueDate.split("T")[0]); // Format YYYY-MM-DD
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [id]);
  

  const handleUpdate = async () => {
    try {
        await axios.put(`http://localhost:5000/tasks/updateTask/${id}
`, { status, priority, dueDate }, {
            withCredentials: true, // Ensure cookies are sent if authentication is needed
        });
        alert("Task updated successfully!");
    } catch (error) {
        console.error("Error updating task:", error.response?.data || error.message);
    }
};


  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      await axios.post(`http://localhost:5000/tasks/task/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  if (!task) return <p>Loading...</p>;

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
      <button onClick={handleUpdate}>Update Task</button>

      <h3>Upload Completion File:</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default TaskDetails;
