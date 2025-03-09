import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state for loading
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/verify", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    navigate("/dashboard"); // Redirect if logged in
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setIsCheckingAuth(false); // Stop loading state
            }
        };

        checkAuth();
    }, [navigate]);

    if (isCheckingAuth) return <div>Loading...</div>; // Prevent rendering while checking auth

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
                            <form className="flip-card__form">
                                <input type="email" placeholder="Email" name="email" className="flip-card__input" required />
                                <input type="password" placeholder="Password" name="password" className="flip-card__input" required />
                                <button type="submit" className="flip-card__btn">Let’s go!</button>
                            </form>
                        </div>
                        <div className="flip-card__back">
                            <div className="title">Sign up</div>
                            <form className="flip-card__form">
                                <input type="text" placeholder="Name" name="username" className="flip-card__input" required />
                                <input type="email" placeholder="Email" name="email" className="flip-card__input" required />
                                <input type="password" placeholder="Password" name="password" className="flip-card__input" required />
                                <button type="submit" className="flip-card__btn">Confirm!</button>
                            </form>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Auth;
