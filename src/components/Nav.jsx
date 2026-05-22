import React from 'react';

export default function Nav({ title = 'EventPortal', sub = '', onBrandClick, onLogout }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={onBrandClick}>
        <div className="nav-logo">📅</div>
        <div>
          <div className="nav-title">{title}</div>
          {sub && <div className="nav-sub">{sub}</div>}
        </div>
      </div>
      <button className="btn btn-ghost" onClick={onLogout}>← Logout</button>
    </nav>
  );
}
