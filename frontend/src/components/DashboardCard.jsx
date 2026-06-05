const DashboardCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        {Icon && <Icon className="text-white" size={24} />}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
