const StockOut = require('../models/StockOut');
const { checkStockAvailability } = require('../services/inventoryService');
const { buildPagination, buildSearchFilter } = require('../utils/helpers');

const createStockOut = async (req, res, next) => {
  try {
    const { itemName, quantityOut, stockOutDate } = req.body;

    const available = await checkStockAvailability(itemName, quantityOut);
    if (!available) {
      return res.status(400).json({ message: 'Quantity exceeds available stock' });
    }

    const stockOut = await StockOut.create({
      itemName,
      quantityOut,
      totalQuantityOut: quantityOut,
      stockOutDate: stockOutDate || Date.now(),
      recordedBy: req.session.userId,
    });

    res.status(201).json(stockOut);
  } catch (error) {
    next(error);
  }
};

const getStockOuts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, startDate, endDate } = req.query;
    const { page: pageNum, limit: limitNum, skip } = buildPagination(page, limit);

    let filter = {};
    if (search) {
      filter = buildSearchFilter(['itemName'], search);
    }
    if (startDate || endDate) {
      filter.stockOutDate = {};
      if (startDate) filter.stockOutDate.$gte = new Date(startDate);
      if (endDate) filter.stockOutDate.$lte = new Date(endDate);
    }

    const [stockOuts, total] = await Promise.all([
      StockOut.find(filter).populate('recordedBy', 'userName').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      StockOut.countDocuments(filter),
    ]);

    res.json({
      data: stockOuts,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

const getStockOut = async (req, res, next) => {
  try {
    const stockOut = await StockOut.findById(req.params.id).populate('recordedBy', 'userName');
    if (!stockOut) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }
    res.json(stockOut);
  } catch (error) {
    next(error);
  }
};

const updateStockOut = async (req, res, next) => {
  try {
    const { itemName, quantityOut, stockOutDate } = req.body;

    const stockOut = await StockOut.findById(req.params.id);
    if (!stockOut) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }

    const newQty = quantityOut !== undefined ? quantityOut : stockOut.quantityOut;
    const newItem = itemName !== undefined ? itemName : stockOut.itemName;

    if (quantityOut !== undefined) {
      const available = await checkStockAvailability(newItem, newQty);
      if (!available) {
        return res.status(400).json({ message: 'Quantity exceeds available stock' });
      }
    }

    if (itemName !== undefined) stockOut.itemName = itemName;
    if (quantityOut !== undefined) {
      stockOut.quantityOut = quantityOut;
      stockOut.totalQuantityOut = quantityOut;
    }
    if (stockOutDate !== undefined) stockOut.stockOutDate = stockOutDate;

    const updated = await stockOut.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteStockOut = async (req, res, next) => {
  try {
    const stockOut = await StockOut.findByIdAndDelete(req.params.id);
    if (!stockOut) {
      return res.status(404).json({ message: 'Stock out record not found' });
    }
    res.json({ message: 'Stock out record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStockOut, getStockOuts, getStockOut, updateStockOut, deleteStockOut };
