import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { APP_ROUTING_PATHS } from '../../constants';
import { EAPIStatus, IAPIError } from '../../../shared/api/models';
import { setSignupLoginPayload, signupRequest } from '../auth.store';
import './Signup.scss';
import SignupSigninPageWrapper, { EViewType } from '../signin-signup-page-wrapper/SignupSigninPageWrapper';

type SignupFormData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signupRes, loginRes } = useAppSelector((state) => state.authStoreReducer);
  const [signupErrorMsg, setSignupErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
    },
  });

  const isSignupPending = signupRes.status === EAPIStatus.PENDING;
  const isAutoLoginPending = loginRes.status === EAPIStatus.PENDING;
  const isSubmitLoading = isSignupPending || isAutoLoginPending;

  const onSubmit = (data: SignupFormData) => {
    setSignupErrorMsg(null);

    dispatch(setSignupLoginPayload({ username: data.username, password: data.password }));

    dispatch(
      signupRequest({
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        department: null,
        phone_number: data.phone_number,
        password: data.password,
      }),
    )
      .unwrap()
      .catch((error: IAPIError) => {
        const serverError = (error?.axiosError?.response?.data as { error?: string; msg?: string } | undefined);
        setSignupErrorMsg(serverError?.error || serverError?.msg || 'Sign up failed. Please try again.');
      });
  };

  return (
    <SignupSigninPageWrapper viewType={EViewType.SIGNUP} wrapperClassName='signup-page-container'>
      <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label htmlFor="signup-username">Username</label>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            }}
            render={({ field }) => <input id="signup-username" type="text" {...field} />}
          />
          {errors.username && <p className="error-text">{errors.username.message}</p>}
        </div>

        <div className="input-grid-two">
          <div className="input-group">
            <label htmlFor="signup-first-name">First Name</label>
            <Controller
              name="first_name"
              control={control}
              rules={{
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              }}
              render={({ field }) => <input id="signup-first-name" type="text" {...field} />}
            />
            {errors.first_name && <p className="error-text">{errors.first_name.message}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="signup-last-name">Last Name</label>
            <Controller
              name="last_name"
              control={control}
              rules={{
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              }}
              render={({ field }) => <input id="signup-last-name" type="text" {...field} />}
            />
            {errors.last_name && <p className="error-text">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="signup-email">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field }) => <input id="signup-email" type="email" {...field} />}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="signup-phone-number">Phone Number</label>
          <Controller
            name="phone_number"
            control={control}
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{9,15}$/,
                message: 'Phone number must contain only digits (9-15 numbers)',
              },
            }}
            render={({ field }) => <input id="signup-phone-number" type="tel" {...field} />}
          />
          {errors.phone_number && <p className="error-text">{errors.phone_number.message}</p>}
        </div>

        <div className="input-grid-two">
          <div className="input-group">
            <label htmlFor="signup-password">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                pattern: {
                  value: PASSWORD_REGEX,
                  message:
                    'Password must be at least 8 characters and include uppercase, lowercase, and a number',
                },
              }}
              render={({ field }) => <input id="signup-password" type="password" {...field} />}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <Controller
              name="confirm_password"
              control={control}
              rules={{
                required: 'Confirm password is required',
                validate: (value) => value === getValues('password') || 'Passwords do not match',
              }}
              render={({ field }) => <input id="signup-confirm-password" type="password" {...field} />}
            />
            {errors.confirm_password && <p className="error-text">{errors.confirm_password.message}</p>}
          </div>
        </div>

        <div className="submit-btn-wrapper">
          {signupErrorMsg && <p className="signup-request-error">{signupErrorMsg}</p>}
          <button type="submit" className="submit-btn" disabled={isSubmitLoading}>
            <span className="submit-btn-content">
              {isSubmitLoading ? (
                <Spin indicator={<LoadingOutlined className="signup-btn-spinner-icon" spin />} />
              ) : (
                'Create Account'
              )}
            </span>
          </button>
        </div>

        <div className="login-wrapper">
          <span className="text-muted">Already have an account? </span>
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate(`${APP_ROUTING_PATHS.AUTH}/${APP_ROUTING_PATHS.LOGIN}`)}
          >
            Login
          </button>
        </div>
      </form>
    </SignupSigninPageWrapper>
  );
};

export default Signup;
