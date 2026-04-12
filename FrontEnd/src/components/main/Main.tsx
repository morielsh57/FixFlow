import { Outlet } from 'react-router-dom';
import './Main.scss';
import { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { getUsersThunk } from '../../shared/store/user.store';
import { getPriorityListReqAction } from '../issue-list/issues.store';

export const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersThunk());
    dispatch(getPriorityListReqAction());
  }, [dispatch]);

  return (
    <div className="app-main">
      <Outlet />
    </div>
  );
};
