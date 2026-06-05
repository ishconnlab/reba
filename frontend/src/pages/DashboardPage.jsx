import { useState, useEffect } from 'react';
import {
  HiOutlineUsers,
  HiOutlineArchive,
  HiOutlineShoppingCart,
  HiOutlineCube,
} from 'react-icons/hi';
import DashboardCard from '../components/DashboardCard';
import useAuth from '../hooks/useAuth';
import { stockInAPI, stockOutAPI, userAPI, reportAPI } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStockIn: 0,
    totalStockOut: 0,
    remainingStock: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let totalUsers = 0;
      let totalStockIn = 0;
      let totalStockOut = 0;
      let remainingStock = 0;
      let recent = [];

      try {
        const usersRes = await userAPI.getAll();
        totalUsers = usersRes.data.length;
      } catch {
        console.log('Users fetch skipped (staff role)');
      }

      try {
        const [stockInRes, stockOutRes, reportRes] = await Promise.all([
          stockInAPI.getAll({ limit: 1000 }),
          stockOutAPI.getAll({ limit: 1000 }),
          reportAPI.dailyStockStatus(),
        ]);

        totalStockIn = stockInRes.data.data.reduce((sum, item) => sum + item.quantityIn, 0);
        totalStockOut = stockOutRes.data.data.reduce((sum, item) => sum + item.quantityOut, 0);
        remainingStock = reportRes.data.stockData.reduce((sum, item) => sum + item.remaining, 0);

        recent = [
          ...stockInRes.data.data.slice(0, 5).map((s) => ({
            ...s,
            type: 'Stock In',
            _id: `in-${s._id}`,
          })),
          ...stockOutRes.data.data.slice(0, 5).map((s) => ({
            ...s,
            type: 'Stock Out',
            _id: `out-${s._id}`,
          })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
      } catch (err) {
        console.error('Failed to fetch stock data:', err);
      }

      setStats({ totalUsers, totalStockIn, totalStockOut, remainingStock });
      setRecentActivities(recent);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${user?.role === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {user?.role === 'admin' && (
          <DashboardCard
            title="Total Users"
            value={stats.totalUsers}
            icon={HiOutlineUsers}
            color="blue"
          />
        )}
        <DashboardCard
          title="Total Stock In"
          value={stats.totalStockIn}
          icon={HiOutlineArchive}
          color="green"
        />
        <DashboardCard
          title="Total Stock Out"
          value={stats.totalStockOut}
          icon={HiOutlineShoppingCart}
          color="yellow"
        />
        <DashboardCard
          title="Remaining Stock"
          value={stats.remainingStock}
          icon={HiOutlineCube}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent activities</p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {activity.itemName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.type === 'Stock In'
                      ? `Received ${activity.quantityIn} units`
                      : `Issued ${activity.quantityOut} units`}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    activity.type === 'Stock In'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
