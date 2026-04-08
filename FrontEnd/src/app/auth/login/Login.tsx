import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './Login.scss';
import LoginPic from '../../../assets/images/LoginPic.jpg';

const WelcomeMessege = () => {
    return (
        <div className="welcome-container">
            <h1 className="first-title">Welcome to FixFlow</h1>
            <h2 className="sub-title">
                We are a new platform that makes your company a more organized workplace with our smart ticketing system
            </h2>
        </div>
    );
};

const MotivationSentences = () => {
    const messages = [
        'Unlock a world of possibilities.',
        "Discover what you've been missing.",
        'Ready to elevate your experience?',
        'Streamline your life, one click at a time.',
        'Experience perfect order.',
        'Bring clarity to your chaos.',
        'Your organized future starts here.',
        'Join us and transform your workflow.',
        'Sign up today and see the difference.',
        "Get started now, it's free and easy.",
    ];

    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setIsVisible(true);
            }, 600);
        }, 4000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className={`Motivation-Sentences ${isVisible ? 'visible' : 'hidden'}`}>
            <h3 style={{ color: 'black', fontSize: '30px' }} className="dynamic-text">
                {messages[index]}
            </h3>
        </div>
    );
};

const Picture = () => {
    return (
        <div className="Login-Pic">
            <img src={LoginPic} className="Picture"></img>
        </div>
    );
};
type LoginFormData = {
    email: string;
    password: string;
};

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    const onSubmit = (data: LoginFormData) => {
        console.log('Login data:', data);
    };

    return (
        <div className="login-container">
            <WelcomeMessege />
            <MotivationSentences />
            <main className="main-content-split">
                <Picture />

                <div className="form-left-split">
                    <h1>Login</h1>
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>

                        <div className="input-group password-group">
                            <label>Password</label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            {errors.password && <p className="error-text">{errors.password.message}</p>}
                        </div>

                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            Login
                        </button>

                        <div className="forgot-password-wrapper">
                            <button
                                type="button"
                                className="forgot-password-btn"
                                onClick={() => console.log('Forgot password clicked')}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <div className="signup-wrapper">
                            <span className="text-muted">Don't have an account? </span>
                            <button type="button" className="signup-btn" onClick={() => console.log('Sign up')}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
