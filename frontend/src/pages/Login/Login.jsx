import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from './Login.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const validateForm = () => {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!password.trim() || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                toast.success(`Welcome back, ${data.user.firstName}!`);
                navigate(from, { replace: true });
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Login to your account</h2>
                    <p className={styles.subtitle}>Welcome back! Please enter your details</p>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordHeader}>
                            <label className={styles.label}>Password</label>
                            <a href="#" className={styles.forgotPassword}>Forgot password?</a>
                        </div>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.rememberMe}>
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="remember" className={styles.rememberLabel}>
                            Remember me
                        </label>
                    </div>

                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    <div className={styles.divider}>
                        <span className={styles.dividerText}>or</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.googleButton}>
                            <FcGoogle className={styles.googleIcon} />
                            Sign in with Google
                        </button>
                    </div>

                    <p className={styles.signUpText}>
                        Don't have an account? <Link to="/signup" className={styles.signUpLink}>Sign Up</Link>
                    </p>
                </form>
            </div>

            <div className={styles.imageContainer}>
                <img src="/plant.jpg" alt="Decorative plant" className={styles.image} />
            </div>
        </div>
    );
}

export default Login;