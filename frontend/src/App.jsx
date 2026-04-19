import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import Settings from './pages/Settings';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`fixed inset-0 z-40 transition duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <button
        type="button"
        className={`absolute inset-0 bg-slate-900/10 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
      />

      <aside
        className={`absolute left-0 top-0 h-full w-72 transform bg-white/90 backdrop-blur-sm shadow-2xl transition duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <span className="text-lg font-semibold text-slate-900">Menu</span>
          <button
            type="button"
            className="text-slate-600 hover:text-slate-900"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-slate-50">
        <aside className="hidden md:flex md:w-64 flex-col border-r border-slate-200 bg-white">
          <div className="p-6 text-white bg-indigo-600">
            <h1 className="text-xl font-bold">MyStudy</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <a className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100" href="/dashboard">
              Dashboard
            </a>
            <a className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100" href="/categories">
              Categories
            </a>
            <a className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100" href="/settings">
              Settings
            </a>
          </nav>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle menu"
              >
                {menuOpen ? '✕' : '☰'}
              </button>

              <div className="text-lg font-semibold text-slate-900">ExpenseManager</div>

              <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-700">
                <NavLink to="/" className="hover:text-slate-900">Dashboard</NavLink>
                <NavLink to="/categories" className="hover:text-slate-900">Categories</NavLink>
                <NavLink to="/settings" className="hover:text-slate-900">Settings</NavLink>
              </nav>
            </div>
          </header>

          <Sidebar isOpen={menuOpen} setIsOpen={setMenuOpen} />

          <main className="mx-auto max-w-7xl px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </main>
      </div>
    </BrowserRouter>
  );
}
