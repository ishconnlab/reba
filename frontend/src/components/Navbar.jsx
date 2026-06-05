import useAuth from '../hooks/useAuth';
import { HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="lg:hidden">
        <h1 className="text-lg font-semibold text-gray-800">SMS</h1>
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <HiOutlineUserCircle size={24} />
          <span className="text-sm font-medium capitalize">{user?.userName}</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          <HiOutlineLogout size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
