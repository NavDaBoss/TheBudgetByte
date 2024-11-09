import {
  useProfileRedirect,
  useDashBoardRedirect,
  useAnalyticsRedirect,
  useLogout,
} from '../hooks/clientUtils';

import '../styles/Navbar.css';

const Navbar = () => {
  const profile = useProfileRedirect();
  const dashboard = useDashBoardRedirect();
  const analytics = useAnalyticsRedirect();
  const logout = useLogout();

  return (
    <div className="header-nav-container">
      <h1 className="header-logo">Budget Byte</h1>
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li className="header-nav-item">
            <button className="header-nav-item-link" onClick={profile}>
              Profile
            </button>
          </li>
          <li className="header-nav-item">
            <button className="header-nav-item-link" onClick={dashboard}>
              Dashboard
            </button>
          </li>
          <li className="header-nav-item">
            <button className="header-nav-item-link" onClick={analytics}>
              Analytics
            </button>
          </li>
          <li className="header-nav-item">
            <button className="header-nav-item-link" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
