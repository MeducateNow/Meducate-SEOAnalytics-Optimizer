import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiSearch, FiClock, FiSettings } from 'react-icons/fi'

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/analyzer', icon: <FiSearch />, label: 'Analyzer' },
    { to: '/history', icon: <FiClock />, label: 'History' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">SEO Optimizer</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>© 2023 SEO Optimizer</p>
      </div>
    </div>
  )
}
