import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useApiData } from '../../shared/hooks/useApiData';
import { useAppDispatch, useAppSelector } from '../store';
import { setItemInLocalStorage } from '../../shared/utils/localStorage.utils';
import { APP_ROUTING_PATHS, AUTH_LOCAL_STORAGE_KEYS } from '../constants';
import { getUserIdFromToken } from './auth.utils';
import { getUserById } from '../../shared/store/user.store';

export const Auth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loginRes } = useAppSelector((store) => store.authStoreReducer);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // observe login results, and if successful, save the tokens and navigate to the issues page
  useApiData(loginRes, {
    onFulfilled(loginData) {
      if (loginData.access && loginData.refresh) {
        const { access, refresh } = loginData;
        setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access);
        setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh);
        const userId = getUserIdFromToken(access);
        // on success login get the user data and navigate to the issues page
        dispatch(getUserById({ id: userId }))
          .unwrap()
          .then((userData) => {
            navigate(`${APP_ROUTING_PATHS.HOME}/${APP_ROUTING_PATHS.ISSUES}`);
            setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.USER, userData.data);
          })
      }
    },
  });

  return <>{children}</>;
};
