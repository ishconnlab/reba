const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');
const { getAllItemsStock } = require('../services/inventoryService');

const getDailyStockStatus = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stockData = await getAllItemsStock();

    const todayStockIn = await StockIn.find({
      stockInDate: { $gte: today, $lt: tomorrow },
    });

    const todayStockOut = await StockOut.find({
      stockOutDate: { $gte: today, $lt: tomorrow },
    });

    res.json({
      date: today,
      stockData,
      todayTransactions: {
        stockInCount: todayStockIn.length,
        stockOutCount: todayStockOut.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDateRangeReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const stockIns = await StockIn.aggregate([
      { $match: { stockInDate: { $gte: start, $lte: end } } },
      { $group: { _id: '$itemName', totalReceived: { $sum: '$quantityIn' } } },
    ]);

    const stockOuts = await StockOut.aggregate([
      { $match: { stockOutDate: { $gte: start, $lte: end } } },
      { $group: { _id: '$itemName', totalIssued: { $sum: '$quantityOut' } } },
    ]);

    const allItems = [...new Set([...stockIns.map((s) => s._id), ...stockOuts.map((s) => s._id)])];
    const reportData = allItems.map((item) => {
      const received = stockIns.find((s) => s._id === item);
      const issued = stockOuts.find((s) => s._id === item);
      const totalReceived = received ? received.totalReceived : 0;
      const totalIssued = issued ? issued.totalIssued : 0;
      return {
        itemName: item,
        totalReceived,
        totalIssued,
        remaining: totalReceived - totalIssued,
      };
    });

    res.json({
      startDate: start,
      endDate: end,
      reportData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDailyStockStatus, getDateRangeReport };
