import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginRequest } from '../auth.store';
import { EAPIStatus } from '../../../shared/api/models';
import { APP_ROUTING_PATHS } from '../../constants';
import SignupSigninPageWrapper, { EViewType } from '../signin-signup-page-wrapper/SignupSigninPageWrapper';

type LoginFormData = {
    username: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();
    const dispatch = useAppDispatch();
    const { loginRes } = useAppSelector((state) => state.authStoreReducer);
    const { getUserByIdRequest } = useAppSelector((state) => state.userStoreReducer);
    const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
    const isLoginPending = loginRes.status === EAPIStatus.PENDING;
    const isUserInfoPending = getUserByIdRequest.status === EAPIStatus.PENDING;
    const isSubmitLoading = isLoginPending || isUserInfoPending;

    const onSubmit = (data: LoginFormData) => {
        setLoginErrorMsg(null);
        dispatch(loginRequest(data))
            .unwrap()
            .catch(() => setLoginErrorMsg('Invalid username or password. Please try again.'));
    };

    return (
        <SignupSigninPageWrapper viewType={EViewType.LOGIN} wrapperClassName='login-page-container'>
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
                    <button type="submit" className="submit-btn" disabled={isSubmitLoading}>
                        <span className="submit-btn-content">
                            {isSubmitLoading ? (
                                <Spin indicator={<LoadingOutlined className="login-btn-spinner-icon" spin />} />
                            ) : (
                                'Login'
                            )}
                        </span>
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
                    <span className="text-muted">Don&apos;t have an account? </span>
                    <button
                        type="button"
                        className="signup-btn"
                        onClick={() => navigate(`${APP_ROUTING_PATHS.AUTH}/${APP_ROUTING_PATHS.SIGNUP}`)}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </SignupSigninPageWrapper>
    );
};

export default Login;
