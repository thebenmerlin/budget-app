'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';

export default function MainLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // prevent body scroll when drawer open (mobile)
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => (document.body.style.overflow = '');
  }, [drawerOpen]);

  return (
    <div className="app-root">
      {/* Desktop sidebar (hidden on small screens via CSS) */}
      <aside className="sidebar" aria-hidden={drawerOpen ? 'true' : 'false'}>
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="main">
        <header className="header">
          <Navbar onOpenDrawer={() => setDrawerOpen(true)} />
        </header>

        <div className="page">
          <div className="container">{children}</div>
        </div>

        <footer className="footer">
          <div className="small muted">© {new Date().getFullYear()} JSPM's Rajarshi Shahu College of Engineering — CSBS</div>
          <div className="small muted">Enterprise Edition</div>
        </footer>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
          }}
        >
          <div
            style={{
              width: 280,
              background: 'var(--card)',
              padding: 16,
              boxShadow: 'var(--shadow-sm)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}