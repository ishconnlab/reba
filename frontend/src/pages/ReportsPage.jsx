import { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import { HiOutlineDownload, HiOutlinePrinter } from 'react-icons/hi';

const ReportsPage = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [dateRangeReport, setDateRangeReport] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [rangeLoading, setRangeLoading] = useState(false);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const { data } = await reportAPI.dailyStockStatus();
        setDailyReport(data);
      } catch (err) {
        console.error('Failed to fetch daily report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, []);

  const fetchDateRange = async () => {
    if (!startDate || !endDate) return;
    try {
      setRangeLoading(true);
      const { data } = await reportAPI.dateRange({ startDate, endDate });
      setDateRangeReport(data);
    } catch (err) {
      console.error('Failed to fetch date range report:', err);
    } finally {
      setRangeLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = (reportData, filename) => {
    const headers = 'Item Name,Total Received,Total Issued,Remaining Stock\n';
    const rows = reportData.map((r) => `${r.itemName},${r.totalReceived},${r.totalIssued},${r.remaining}`).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTable = (data, title) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportCSV(data, title.replace(/\s+/g, '_').toLowerCase())}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <HiOutlineDownload size={16} />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <HiOutlinePrinter size={16} />
            Print
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Received</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Issued</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.itemName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.totalReceived}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.totalIssued}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-semibold ${row.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {row.remaining}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>

      {dailyReport && renderTable(dailyReport.stockData, 'Daily Stock Status Report')}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Date Range Report</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button onClick={fetchDateRange} disabled={rangeLoading || !startDate || !endDate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            {rangeLoading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {dateRangeReport && renderTable(dateRangeReport.reportData,
        `Stock Status Report (${new Date(dateRangeReport.startDate).toLocaleDateString()} - ${new Date(dateRangeReport.endDate).toLocaleDateString()})`)}
    </div>
  );
};

export default ReportsPage;
