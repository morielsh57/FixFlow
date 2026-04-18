import React from 'react';
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
