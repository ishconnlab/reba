import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineArchive,
  HiOutlineShoppingCart,
  HiOutlineDocumentReport,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import useAuth from '../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const allLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid, adminOnly: false },
    { to: '/users', label: 'Users', icon: HiOutlineUsers, adminOnly: true },
    { to: '/stock-in', label: 'Stock In', icon: HiOutlineArchive, adminOnly: false },
    { to: '/stock-out', label: 'Stock Out', icon: HiOutlineShoppingCart, adminOnly: false },
    { to: '/reports', label: 'Reports', icon: HiOutlineDocumentReport, adminOnly: false },
  ];

  const links = allLinks.filter((link) => !link.adminOnly || user?.role === 'admin');

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md lg:hidden"
      >
        {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">SMS</h1>
          <p className="text-sm text-gray-400">Store Management System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              <link.icon size={22} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
};

export default Sidebar;
