import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './Login.scss';
import LoginPic from '../../../assets/images/LoginPic.jpg';

const WelcomeMessege = () => {
    return (
        <div
            style={{
                top: 12,
                left: 12,
                right: 12,
                justifyContent: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '40px',
                textAlign: 'center',
            }}
        >
            <h1 style={{ color: 'black', fontSize: '45px' }}>Welcome to FixFlow</h1>
            <h2 style={{ color: '#643fd4', marginTop: '30px', textAlign: 'center', fontSize: '38px' }}>
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
            <img
                src={LoginPic}
                className="Login-Picture"
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            ></img>
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
            <div style={{ marginBottom: '40px' }}>
                <WelcomeMessege />
            </div>

            <div style={{ marginTop: '40px' }}>
                <MotivationSentences />
            </div>

            <main
                className="main-content-split"
                style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '1400px',
                    gap: '80px',
                }}
            >
                <div
                    className="Picture-right-side"
                    style={{
                        alignSelf: 'stretch',
                        display: 'flex',
                        justifyContent: 'center',
                        flex: 1.2,
                        alignItems: 'center',
                        minHeight: '800px',
                        minWidth: '800px',
                    }}
                >
                    <Picture />
                </div>

                <div
                    className="form-left-split"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px', width: '100%' }}>
                        <div style={{ marginBottom: '25px' }}>
                            <label
                                style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: 'black',
                                    letterSpacing: '0.3px',
                                    marginLeft: '4px',
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    fontSize: '1.1rem',
                                    borderRadius: '12px',
                                    border: '2px solid #643fd4',
                                    backgroundColor: '#fcfcfc',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                        </div>

                        <div style={{ marginBottom: '35px' }}>
                            <label
                                style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: 'black',
                                    letterSpacing: '0.3px',
                                    marginLeft: '4px',
                                }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    fontSize: '1.1rem',
                                    borderRadius: '12px',
                                    border: '2px solid #643fd4',
                                    backgroundColor: '#fcfcfc',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                marginTop: '10px',
                                backgroundColor: '#643fd4',
                                color: '#fcfcfc',
                                border: 'none',
                                borderRadius: '12px',
                            }}
                        >
                            Login
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                            <button
                                type="button"
                                onClick={() => console.log('Forgot password clicked')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#643fd4',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    padding: '0',
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '1rem' }}>
                            <span style={{ color: '#666' }}>Don't have an account? </span>
                            <button
                                type="button"
                                onClick={() => console.log('Sign up')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#643fd4',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    padding: '0 5px',
                                }}
                            >
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
