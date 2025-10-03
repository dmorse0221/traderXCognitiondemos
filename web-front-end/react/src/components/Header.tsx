import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <img 
            src="/assets/img/traderx-apple-touch-icon.png" 
            alt="TraderX" 
            width="50" 
            style={{ marginRight: '16px' }}
          />
          <span className="navbar-brand" style={{ fontSize: '1.5em' }}>
            FINOS | TraderX Sample Application
          </span>
          <img 
            src="/assets/img/FINOS_Icon_White.png" 
            alt="FINOS" 
            width="30" 
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </nav>
      <ul className="nav nav-tabs" style={{ marginTop: '16px', marginBottom: '16px' }}>
        <li className="nav-item">
          <Link 
            className={`nav-link ${currentPath === '/' ? 'active' : ''}`} 
            to="/"
          >
            Trade
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            className={`nav-link ${currentPath === '/account' ? 'active' : ''}`} 
            to="/account"
          >
            Account
          </Link>
        </li>
      </ul>
    </>
  );
};
