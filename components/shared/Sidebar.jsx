'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname?.() || (typeof window !== 'undefined' ? window.location.pathname : '/');

  const items = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/expenses', label: 'Expenses' },
    { href: '/budget', label: 'Budget' },
    { href: '/reports', label: 'Reports' },
  ];

  return (
    <nav aria-label="Main" style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'8px 0 14px 0', borderBottom:'1px solid var(--border)'}}>
        <div className="small muted">MAIN</div>
      </div>

      <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6}}>
        {items.map(it => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          return (
            <li key={it.href}>
              <Link href={it.href} style={{
                display:'block',
                padding:'10px 12px',
                borderRadius:8,
                color: active ? 'var(--primary)' : 'inherit',
                background: active ? 'rgba(130,25,16,0.06)' : 'transparent',
                fontWeight: active ? 700 : 600,
                textDecoration: 'none'
              }}>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div style={{flex:1}} />

      <div style={{paddingTop:12,borderTop:'1px solid var(--border)'}}>
        <Link href="/settings" style={{textDecoration:'none'}}>
          <div className="btn" style={{width:'100%',justifyContent:'center'}}>Settings</div>
        </Link>
      </div>
    </nav>
  );
}