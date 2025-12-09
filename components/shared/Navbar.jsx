'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ onOpenDrawer }) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingXls, setLoadingXls] = useState(false);

  async function downloadFile(url, defaultName) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const blob = await res.blob();
      const filename = res.headers.get('x-filename') || defaultName;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Download error', err);
      alert('Download failed: ' + err.message);
    }
  }

  async function handlePdfExport() {
    setLoadingPdf(true);
    // example: pass query params if you want: ?from=...&to=...
    await downloadFile('/api/export/pdf?from=&to=', 'expenses.pdf');
    setLoadingPdf(false);
  }

  async function handleExcelExport() {
    setLoadingXls(true);
    await downloadFile('/api/export/excel?from=&to=', 'expenses.xlsx');
    setLoadingXls(false);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <div className="brand">
        <div className="logo" aria-hidden="true">
          <img src="/logo.jpeg" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e)=>{ e.currentTarget.style.display='none'; }} />
          <span style={{display:'none'}}>₹</span>
        </div>
        <div className="txt">
          <div className="org">JSPM's Rajarshi Shahu College of Engineering</div>
          <div className="dept">Computer Science and Business Systems</div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div className="space-between" style={{ gap: 10 }}>
        <button className="btn" onClick={handleExcelExport} title="Export Excel" aria-label="Export Excel">
          {loadingXls ? 'Preparing…' : 'Export Excel'}
        </button>

        <button className="btn btn--primary" onClick={handlePdfExport} title="Export PDF" aria-label="Export PDF">
          {loadingPdf ? 'Preparing…' : 'Export PDF'}
        </button>

        <button className="icon" onClick={() => {
          if (typeof onOpenDrawer === 'function') onOpenDrawer();
        }} aria-label="Menu">
          ☰
        </button>
      </div>
    </div>
  );
}