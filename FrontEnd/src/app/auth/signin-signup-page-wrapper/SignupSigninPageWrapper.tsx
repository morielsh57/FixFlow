import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { getDepartmentsThunk } from '../../../shared/store/departments/departments.store';
import { EAPIStatus } from '../../../shared/api/models';
import Picture from './Picture/Picture';
import WelcomeMessage from './Welcome-Message/WelcomeMessage';
import MotivationSentences from './Motivation-Message/MotivationSentences';
import './SignupSigninPageWrapper.scss';

export enum EViewType {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

interface ISignupSigninPageWrapperProps {
  viewType: EViewType;
  children: React.ReactNode;
  wrapperClassName?: string;
}

const TITLE_BY_VIEW_TYPE: Record<ISignupSigninPageWrapperProps['viewType'], string> = {
  [EViewType.LOGIN]: 'Login',
  [EViewType.SIGNUP]: 'Sign Up',
};

const SignupSigninPageWrapper: React.FC<ISignupSigninPageWrapperProps> = ({ 
  children, 
  viewType, 
  wrapperClassName = '' 
}) => {
  const dispatch = useAppDispatch();
  const { departments, getDepartmentsRequest } = useAppSelector(
    (state) => state.departmentsStoreReducer,
  );

  useEffect(() => {
    // Guard against an infinite dispatch loop:
    // fetch only once when data does not exist and the request is still IDLE.
    if (departments.length > 0 || getDepartmentsRequest.status !== EAPIStatus.IDLE) {
      return;
    }

    dispatch(getDepartmentsThunk());
  }, [departments.length, dispatch, getDepartmentsRequest.status]);

  return (
    <div className={`signup-signin-container ${wrapperClassName}`}>
      <WelcomeMessage />
      <MotivationSentences />
      <main className="main-content-split">
        <Picture />

        <div className="form-left-split">
          <h2 className="form-title">{TITLE_BY_VIEW_TYPE[viewType]}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default SignupSigninPageWrapper;
