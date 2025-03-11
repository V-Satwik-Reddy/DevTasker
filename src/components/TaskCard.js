import { useNavigate } from "react-router-dom";
import "./Taskcard.css";
const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="task-card" 
      onClick={() => navigate(`/task/${task._id}`)}
    >
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {task.status}</p>
    </div>
  );
};

export default TaskCard;
