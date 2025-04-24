import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaGoogle } from "react-icons/fa";
import Loader from './loader.js';
const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "", username: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://devtaskerb.up.railway.app/auth/verify", {
                    method: "GET",
                    credentials: "include",
                });
    
                if (response.ok) {
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setIsCheckingAuth(false);
            }
        };
    
        checkAuth();
    
        // Check if the user is coming from Google OAuth redirect
        if (window.location.pathname === "/auth/google/callback") {
            window.location.href = "/dashboard"; // Redirect to dashboard after login
        }
    }, [navigate]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

        const handleLogin = async (e) => {
            e.preventDefault();
            try {
                const response = await fetch("https://devtaskerb.up.railway.app/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    navigate("/dashboard");
                } else {
                    alert(data.message || "Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
            }
        };
    
        const handleSignup = async (e) => {
            e.preventDefault();
            try {
                const response = await fetch("https://devtaskerb.up.railway.app/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(formData),
                });
    
                const data = await response.json();
                if (response.ok) {
                    navigate("/dashboard");
                } else {
                    alert(data.message || "Signup failed");
                }
            } catch (error) {
                console.error("Signup error:", error);
            }
        };
    

    if (isCheckingAuth) return <div><Loader/></div>;

    return (
        <div className="wrapper">
            <div className="card-switch">
                <label className="switch">
                    <input className="toggle" type="checkbox" onChange={() => setIsSignup(!isSignup)} checked={isSignup} />
                    <span className="slider"></span>
                    <span className="card-side"></span>
                    <div className="flip-card__inner">
                        <div className="flip-card__front">
                            <div className="title">Log in</div>
                            <form className="flip-card__form" onSubmit={handleLogin}>
                                <input type="email" placeholder="Email" name="email" className="flip-card__input" required onChange={handleChange} />
                                <input type="password" placeholder="Password" name="password" className="flip-card__input" required onChange={handleChange} />
                                <button type="submit" className="flip-card__btn">Let’s go!</button>
                                <a href="https://devtaskerb.up.railway.app/auth/google" className="google-btn">
                                    <FaGoogle className="icon" /> Log In With Google
                                </a>
                            </form>
                        </div>
                        <div className="flip-card__back">
                            <div className="title">Sign up</div>
                            <form className="flip-card__form" onSubmit={handleSignup}>
                                <input type="text" placeholder="Name" name="username" className="flip-card__input" required onChange={handleChange} />
                                <input type="email" placeholder="Email" name="email" className="flip-card__input" required onChange={handleChange} />
                                <input type="password" placeholder="Password" name="password" className="flip-card__input" required onChange={handleChange} />
                                <button type="submit" className="flip-card__btn">Confirm!</button>
                                <a href="https://devtaskerb.up.railway.app/auth/google" className="google-btn">
                                    <FaGoogle className="icon" /> Log In With Google
                                </a>
                            </form>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Auth;
