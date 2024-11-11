import {
  useHomeRedirect,
  useProfileRedirect,
  useDashBoardRedirect,
  useAnalyticsRedirect,
  useLogout,
} from '../hooks/clientUtils';
import { usePathname } from 'next/navigation';

import '../styles/Navbar.css';

const Navbar = () => {
  const pathname = usePathname();
  const home = useHomeRedirect();
  const profile = useProfileRedirect();
  const dashboard = useDashBoardRedirect();
  const analytics = useAnalyticsRedirect();
  const logout = useLogout();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="header-nav-container">
      <h1 className="header-logo" onClick={home} style={{ cursor: 'pointer' }}>
        Budget Byte
      </h1>
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li className="header-nav-item">
            <button
              className={`header-nav-item-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={profile}
            >
              Profile
            </button>
          </li>
          <li className="header-nav-item">
            <button
              className={`header-nav-item-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={dashboard}
            >
              Dashboard
            </button>
          </li>
          <li className="header-nav-item">
            <button
              className={`header-nav-item-link ${isActive('/analytics') ? 'active' : ''}`}
              onClick={analytics}
            >
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
