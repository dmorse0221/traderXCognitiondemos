import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary text-bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <img width="50px" src="/traderx-apple-touch-icon.png" alt="TraderX Logo" />
          <div style={{ fontSize: '1.5em' }}>FINOS | TraderX Sample Application</div>
          <img width="30px" src="/FINOS_Icon_White.png" alt="FINOS Logo" />
        </div>
      </nav>

      <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
            to="/trade"
          >
            Trade
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
            to="/account"
          >
            Account
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default Header;
