// components/Sidebar.jsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col"
    >
      {/* Header section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary leading-tight">
          CSBS Department
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          JSPM's Rajarshi Shahu College of Engineering
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem href="/dashboard" label="Dashboard" />
        <SidebarItem href="/expenses" label="Expenses" />
        <SidebarItem href="/expenses/add" label="Add Expense" />
        <SidebarItem href="/budget" label="Budget" />
        <SidebarItem href="/reports" label="Reports" />
      </nav>
    </aside>
  );
}

function SidebarItem({ href, label }) {
  return (
    <Link
      href={href}
      className="
        block px-4 py-2 rounded-md text-gray-700 hover:bg-primary hover:text-white
        transition-colors duration-150 font-medium text-sm
      "
    >
      {label}
    </Link>
  );
}
