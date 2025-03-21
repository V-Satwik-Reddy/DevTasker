//app.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Auth from "./Auth";
import Dashboard from "./dashboard";
import NavbarComponent from "./components/navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./Landingpage";
import AddTask from "./addTask";
import TaskDetails from "./components/TaskDetails";

const ProtectedRoute = ({ element: Component }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;
    return (
        <>
            <NavbarComponent user={user} />
            <Component user={user} />
        </>
    );
     
};



function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/Auth" element={<Auth  />} />
                <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
                <Route path="/add-task" element={<ProtectedRoute element={AddTask} />} />
                <Route path="/task/:id" element={<ProtectedRoute element={TaskDetails} />} />
            </Routes>
        </Router>
    );
}

export default App;
