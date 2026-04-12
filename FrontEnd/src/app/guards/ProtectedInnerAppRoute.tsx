import { FunctionComponent, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROUTING_PATHS, AUTH_LOCAL_STORAGE_KEYS } from '../constants';

interface IProps {
  children: ReactElement;
}

export const ProtectedInnerAppRoute: FunctionComponent<IProps> = ({ children }) => {
  const tokenLocalStorage = localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  return tokenLocalStorage ? children : (
    <Navigate to={`${APP_ROUTING_PATHS.AUTH}/${APP_ROUTING_PATHS.LOGIN}`} replace />
  );
};
