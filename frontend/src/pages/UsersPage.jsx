import { useState, useEffect } from 'react';
import { HiOutlineUserAdd } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import { userAPI } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const initialForm = { userName: '', password: '', role: 'staff' };

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.userName || (!editingId && !formData.password)) {
      setError('Username and password are required');
      return;
    }

    try {
      if (editingId) {
        await userAPI.update(editingId, formData);
      } else {
        await userAPI.create(formData);
      }
      setModalOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setFormData({ userName: user.userName, password: '', role: user.role });
    setEditingId(user._id);
    setModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.userName}"?`)) return;
    try {
      await userAPI.delete(user._id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'userName', label: 'Username' },
    { key: 'role', label: 'Role', render: (row) => (
      <span className="capitalize text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{row.role}</span>
    )},
    { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => { setFormData(initialForm); setEditingId(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <HiOutlineUserAdd size={18} />
            Add User
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <DataTable
          columns={columns}
          data={users}
          onEdit={currentUser?.role === 'admin' ? handleEdit : null}
          onDelete={currentUser?.role === 'admin' ? handleDelete : null}
          loading={loading}
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit User' : 'Add User'}>
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingId && '(leave blank to keep)'}</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {editingId ? 'Update' : 'Create'} User
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
