import { Outlet } from 'react-router-dom';
import './Main.scss';

export const Main = () => {

  return (
    <div className="app-main">
      <Outlet />
    </div>
  );
};
