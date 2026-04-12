import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Login.scss';
import LoginPic from '../../../assets/images/LoginPic.jpg';
import WelcomeMessage from './Welcome-Message/WelcomeMessage';
import MotivationSentences from './Motivation-Message/MotivationSentences';
import './Welcome-Message/WelcomeMessage.scss';
import { useAppDispatch } from '../../store';
import { loginRequest } from '../auth.store';

const Picture = () => {
    return (
        <div className="login-Pic">
            <img src={LoginPic} className="picture" alt="login" />
        </div>
    );
};
type LoginFormData = {
    username: string;
    password: string;
};

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();
    const dispatch = useAppDispatch();
    const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);

    const onSubmit = (data: LoginFormData) => {
        setLoginErrorMsg(null);
        dispatch(loginRequest(data))
            .unwrap()
            .catch(() => setLoginErrorMsg('Invalid username or password. Please try again.'));
    };

    return (
        <div className="login-container">
            <WelcomeMessage />
            <MotivationSentences />
            <main className="main-content-split">
                <Picture />

                <div className="form-left-split">
                    <div className="Login-Title">
                        <h1>Login</h1>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Username Field */}
                        <div className="input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters',
                                    },
                                })}
                            />
                            {errors.username && <p className="error-text">{errors.username.message}</p>}
                        </div>

                        <div className="input-group password-group">
                            <label>Password</label>
                            <input
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters',
                                    },
                                })}
                            />
                            {errors.password && <p className="error-text">{errors.password.message}</p>}
                        </div>

                        <div className="submit-btn-wrapper">
                            {loginErrorMsg && <p className="login-request-error">{loginErrorMsg}</p>}
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                Login
                            </button>
                        </div>

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
