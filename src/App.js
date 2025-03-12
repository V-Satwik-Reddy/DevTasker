//app.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Auth from "./Auth";
import Dashboard from "./dashboard";
import NavbarComponent from "./components/navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./Landingpage";
import AddTask from "./addTask";
import TaskDetails from "./components/TaskDetails";

const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/verify", {
                    method: "GET",
                    credentials: "include", // ✅ Ensures cookies are sent
                });

                setIsAuthenticated(response.ok);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) return ; // Prevents flickering
    return isAuthenticated ? element : <Navigate to="/Auth" />;
};

function App() {
    const [refreshNavbar, setRefreshNavbar] = useState(false);

    return (
        <Router>
            <NavbarComponent key={refreshNavbar} />
            <Routes>
              <Route path="/" element={<LandingPage />} />
                <Route path="/Auth" element={<Auth onLoginSuccess={() => setRefreshNavbar(prev => !prev)} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/add-task" element={<ProtectedRoute element={<AddTask />} />} />
                <Route path="/task/:id" element={<ProtectedRoute element={<TaskDetails />} />} />
            </Routes>
        </Router>
    );
}

export default App;
