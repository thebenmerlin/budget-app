'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Download, FileJson } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isExporting, setIsExporting] = useState(false);

  const pageTitles = {
    '/dashboard': {
      title: 'Dashboard',
      description: 'Overview of budget and expenses',
    },
    '/expenses': {
      title: 'Expenses',
      description: 'Manage and track all expenses',
    },
    '/expenses/add': {
      title: 'Add Expense',
      description: 'Record a new expense entry',
    },
    '/budget': {
      title: 'Budget Management',
      description: 'Manage budget allocations and proposals',
    },
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/dashboard' }];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast,
      });
    });

    return breadcrumbs;
  };

  const currentPage = pageTitles[pathname] || {
    title: 'Page',
    description: '',
  };

  const showExportButtons =
    pathname === '/dashboard' || pathname === '/expenses';

  const handleExcelExport = async () => {
    setIsExporting(true);
    try {
      const url = `/api/export/excel?from=&to=&category=&vendor=&activity=`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePdfExport = async () => {
    setIsExporting(true);
    try {
      const url = `/api/export/pdf?from=&to=&category=&vendor=&activity=`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
      <div className="ml-64">
        {/* Breadcrumb Section */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200">
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight size={16} className="text-neutral-400" />
                )}
                {crumb.isLast ? (
                  <span className="text-neutral-600 font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-rsblue hover:text-crimson transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Header Content */}
        <div className="px-6 py-6 flex items-start justify-between">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900">
              {currentPage.title}
            </h1>
            {currentPage.description && (
              <p className="mt-2 text-sm text-neutral-600">
                {currentPage.description}
              </p>
            )}
          </div>

          {/* Export Buttons */}
          {showExportButtons && (
            <div className="flex items-center gap-3 ml-6">
              <button
                onClick={handleExcelExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                title="Export data to Excel spreadsheet"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Excel</span>
              </button>

              <button
                onClick={handlePdfExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-crimson text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                title="Export data to PDF document"
              >
                <FileJson size={18} />
                <span className="hidden sm:inline">PDF</span>
              </button>

              {isExporting && (
                <span className="text-xs text-neutral-500 animate-pulse">
                  Exporting...
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
