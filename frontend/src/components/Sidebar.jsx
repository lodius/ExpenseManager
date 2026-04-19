import React from 'react';
import { Home, CreditCard, PieChart, Settings, LogOut } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Expenses', icon: CreditCard, href: '/expenses' },
  { label: 'Reports', icon: PieChart, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export const Sidebar = () => (
  <aside className="w-72 min-h-screen bg-indigo-600 text-white flex flex-col">
    <div className="px-6 py-8 border-b border-indigo-500">
      <h1 className="text-2xl font-bold">ExpenseManager</h1>
      <p className="mt-1 text-sm text-indigo-200">Overview & reports</p>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-indigo-500"
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </a>
      ))}
    </nav>

    <div className="px-4 py-6 border-t border-indigo-500">
      <button className="flex w-full items-center gap-3 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-medium transition hover:bg-indigo-400">
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  </aside>
);