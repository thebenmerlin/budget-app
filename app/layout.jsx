import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Budget Management System - CSBS Department',
  description:
    'Enterprise-grade budget tracking and expense management system for academic departments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50`}>
        <div className="flex min-h-screen bg-neutral-50">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col ml-64">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <div className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-neutral-200 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Section */}
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Budget Management System
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Enterprise-grade budget tracking and expense management for
                      academic departments.
                    </p>
                  </div>

                  {/* Center Section */}
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3">
                      Quick Links
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="/dashboard"
                          className="text-neutral-600 hover:text-crimson transition-colors"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="/expenses"
                          className="text-neutral-600 hover:text-crimson transition-colors"
                        >
                          Expenses
                        </a>
                      </li>
                      <li>
                        <a
                          href="/budget"
                          className="text-neutral-600 hover:text-crimson transition-colors"
                        >
                          Budget
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Right Section */}
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-3">
                      Institution
                    </h4>
                    <p className="text-sm text-neutral-600">
                      Rajarshi Shahu College of Engineering
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      CSBS Department
                    </p>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-neutral-600">
                    © 2024 Budget Management System. All rights reserved.
                  </p>
                  <p className="text-xs text-neutral-500">
                    Enterprise Edition v1.0
                  </p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
