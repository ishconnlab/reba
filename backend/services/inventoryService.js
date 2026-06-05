const StockIn = require('../models/StockIn');
const StockOut = require('../models/StockOut');

const getItemStock = async (itemName) => {
  const stockInResult = await StockIn.aggregate([
    { $match: { itemName } },
    { $group: { _id: null, totalReceived: { $sum: '$quantityIn' } } },
  ]);

  const stockOutResult = await StockOut.aggregate([
    { $match: { itemName } },
    { $group: { _id: null, totalIssued: { $sum: '$quantityOut' } } },
  ]);

  const totalReceived = stockInResult.length > 0 ? stockInResult[0].totalReceived : 0;
  const totalIssued = stockOutResult.length > 0 ? stockOutResult[0].totalIssued : 0;

  return {
    itemName,
    totalReceived,
    totalIssued,
    remaining: totalReceived - totalIssued,
  };
};

const getAllItemsStock = async () => {
  const stockInItems = await StockIn.distinct('itemName');
  const stockOutItems = await StockOut.distinct('itemName');
  const allItems = [...new Set([...stockInItems, ...stockOutItems])];

  const stockData = [];
  for (const item of allItems) {
    const data = await getItemStock(item);
    stockData.push(data);
  }

  return stockData;
};

const checkStockAvailability = async (itemName, quantity) => {
  const stock = await getItemStock(itemName);
  return stock.remaining >= quantity;
};

module.exports = { getItemStock, getAllItemsStock, checkStockAvailability };
