import { useState, useEffect, useCallback } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import { stockInAPI } from '../services/api';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

const initialForm = { itemName: '', description: '', quantityIn: '', supplierName: '', stockInDate: '' };

const ITEMS = ['Steel Bars', 'Wheelbarrows', 'Ceramic Tiles', 'Cement', 'Painting Brush', 'Color Paint', 'Masonry Nails', 'Iron Sheets'];

const StockInPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [customItem, setCustomItem] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await stockInAPI.getAll({ page, limit: 10, search });
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...formData,
      itemName: formData.itemName === '__custom__' ? customItem : formData.itemName,
      quantityIn: parseInt(formData.quantityIn),
    };

    if (!payload.itemName || !payload.quantityIn || !payload.supplierName) {
      setError('Item name, quantity, and supplier are required');
      return;
    }

    try {
      if (editingId) {
        await stockInAPI.update(editingId, payload);
      } else {
        await stockInAPI.create(payload);
      }
      setModalOpen(false);
      setFormData(initialForm);
      setCustomItem('');
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (row) => {
    setFormData({
      itemName: row.itemName,
      description: row.description || '',
      quantityIn: row.quantityIn,
      supplierName: row.supplierName,
      stockInDate: row.stockInDate ? row.stockInDate.split('T')[0] : '',
    });
    setEditingId(row._id);
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete stock in record for "${row.itemName}"?`)) return;
    try {
      await stockInAPI.delete(row._id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'itemName', label: 'Item Name' },
    { key: 'quantityIn', label: 'Quantity' },
    { key: 'supplierName', label: 'Supplier' },
    { key: 'stockInDate', label: 'Date', render: (row) => new Date(row.stockInDate).toLocaleDateString() },
    { key: 'recordedBy', label: 'Recorded By', render: (row) => row.recordedBy?.userName || 'N/A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Stock In</h1>
        <button
          onClick={() => { setFormData(initialForm); setEditingId(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <HiOutlinePlus size={18} />
          Add Stock In
        </button>
      </div>

      <div className="max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by item or supplier..." />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <DataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Stock In' : 'Add Stock In'} size="lg">
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <select
              value={ITEMS.includes(formData.itemName) ? formData.itemName : '__custom__'}
              onChange={(e) => setFormData({...formData, itemName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select item...</option>
              {ITEMS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
              <option value="__custom__">Other (type below)</option>
            </select>
            {formData.itemName === '__custom__' && (
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="Enter custom item name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity In</label>
            <input type="number" min="1" value={formData.quantityIn} onChange={(e) => setFormData({...formData, quantityIn: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
            <input type="text" value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock In Date</label>
            <input type="date" value={formData.stockInDate} onChange={(e) => setFormData({...formData, stockInDate: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            {editingId ? 'Update' : 'Add'} Stock In
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StockInPage;
