import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styles from './Signup.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!name.trim() || name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Enter a valid email");
            return false;
        }
        if (!password.trim() || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (!agreed) {
            toast.error("You must agree to the terms & policy");
            return false;
        }
        return true;
    };

    const splitName = (fullName) => {
        const parts = fullName.trim().split(' ');
        return {
            firstName: parts[0],
            lastName: parts.slice(1).join(' ') || ''
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const { firstName, lastName } = splitName(name);

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email: email.trim().toLowerCase(),
                    password,
                    role: 'user'
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Welcome, ${firstName}! Account created successfully.`);
                navigate('/login');
            } else {
                toast.error(data.message || "Signup failed");
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Get Started Now</h2>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            maxLength={50}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            maxLength={100}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${styles.input} ${styles.passwordInput}`}
                                maxLength={50}
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

                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="terms" className={styles.termsLabel}>
                            I agree to the <a href="#" className={styles.termsLink}>terms & policy</a>
                        </label>
                    </div>

                    <button type="submit" className={styles.signupButton} disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <div className={styles.divider}>
                        <span className={styles.dividerText}>or</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button type="button" className={styles.googleButton}>
                            <FcGoogle className={styles.socialIcon} />
                            Sign up with Google
                        </button>
                        <button type="button" className={styles.appleButton}>
                            <FaApple className={styles.socialIcon} />
                            Sign up with Apple
                        </button>
                    </div>

                    <p className={styles.loginPrompt}>
                        Have an account? <Link to="/login" className={styles.loginLink}>Sign In</Link>
                    </p>
                </form>
            </div>

            <div className={styles.imageContainer}>
                <img src="/plant.jpg" alt="Decorative plant" className={styles.image} />
            </div>
        </div>
    );
}

export default Signup;