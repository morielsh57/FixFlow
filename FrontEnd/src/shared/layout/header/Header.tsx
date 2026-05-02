import { useAppSelector } from '../../../app/store';
import { logOut } from '../../utils/logout';
import './Header.scss';

const Header = () => {
  const { user } = useAppSelector((state) => state.userStoreReducer);

  const getUserName = () => {
    if (user?.first_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    if (user?.username) {
      return user.username;
    }

    return 'User';
  };

  return (
    <header className="app-header">
      <div className='user-details-wrapper'>
        <p className="header-user-name">Logged in as <span>{getUserName()}</span></p>
        {user?.is_manager && user?.department?.title && <p className="header-department-manager"><span>{user.department.title}</span> Department Manager</p>}
      </div>

      <button type="button" className="app-header--logout-btn" onClick={logOut}>
        Logout
      </button>
    </header>
  );
};

export default Header;
