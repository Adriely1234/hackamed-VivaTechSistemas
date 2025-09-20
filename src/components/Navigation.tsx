import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/patients', label: 'Pacientes' },
    { path: '/reports', label: 'Relatórios' }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <h1 className="navbar-title">
            VivaTech Sistemas
          </h1>
          <div className="navbar-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};