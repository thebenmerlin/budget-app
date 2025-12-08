'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Expenses',
      href: '/expenses',
      icon: DollarSign,
    },
    {
      label: 'Add Expense',
      href: '/expenses/add',
      icon: FileText,
    },
    {
      label: 'Budget',
      href: '/budget',
      icon: BarChart3,
    },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-neutral-200 lg:hidden hover:bg-neutral-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-neutral-900 text-white overflow-y-auto border-r border-neutral-800 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Section */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 z-10">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-white">CSBS Department</h1>
            <p className="text-xs text-neutral-400 leading-tight">
              Rajarshi Shahu College of Engineering
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              Budget Management System
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-2 p-4 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-crimson text-white shadow-md'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 to-transparent p-4 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 space-y-1">
            <p>© 2024 Budget Management</p>
            <p>Enterprise Edition v1.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
