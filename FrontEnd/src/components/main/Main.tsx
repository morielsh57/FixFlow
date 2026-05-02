import { Outlet } from 'react-router-dom';
import './Main.scss';
import { useEffect } from 'react';
import { store, useAppDispatch } from '../../app/store';
import { getUserById, getUsersThunk } from '../../shared/store/user.store';
import { getPriorityListReqAction } from '../issue-list/issues.store';
import { getItemFromLocalStorage } from '../../shared/utils/localStorage.utils';
import { AUTH_LOCAL_STORAGE_KEYS } from '../../app/constants';
import { IUser } from '../../shared/store/user.types';
import { logOut } from '../../shared/utils/logout';
import { getUserIdFromToken } from '../../app/auth/auth.utils';
import Header from '../../shared/layout/header/Header';
import { getDepartmentsThunk } from '../../shared/store/departments/departments.store';

export const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersThunk());
    dispatch(getPriorityListReqAction());
    if(store.getState().departmentsStoreReducer.departments.length === 0) {
      dispatch(getDepartmentsThunk());
    }
    // on app load, check if user data is available in local storage, if not try to get it using the user id from local storage, if that also fails, log out the user
    const userData = getItemFromLocalStorage<IUser>(AUTH_LOCAL_STORAGE_KEYS.USER);
    if (!userData?.id) {
      const token = getItemFromLocalStorage<string>(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      const userId = getUserIdFromToken(token || '');
      if (userId) {
        dispatch(getUserById({ id: Number(userId) }));
      } else logOut();
    }
  }, [dispatch]);

  return (
    <div className="app-main">
      <Header />
      <Outlet />
    </div>
  );
};
