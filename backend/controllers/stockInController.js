const StockIn = require('../models/StockIn');
const { buildPagination, buildSearchFilter } = require('../utils/helpers');

const createStockIn = async (req, res, next) => {
  try {
    const { itemName, description, quantityIn, supplierName, stockInDate } = req.body;

    const stockIn = await StockIn.create({
      itemName,
      description,
      quantityIn,
      totalQuantityIn: quantityIn,
      supplierName,
      stockInDate: stockInDate || Date.now(),
      recordedBy: req.session.userId,
    });

    res.status(201).json(stockIn);
  } catch (error) {
    next(error);
  }
};

const getStockIns = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sort, startDate, endDate } = req.query;
    const { page: pageNum, limit: limitNum, skip } = buildPagination(page, limit);

    let filter = {};
    if (search) {
      filter = buildSearchFilter(['itemName', 'supplierName'], search);
    }
    if (startDate || endDate) {
      filter.stockInDate = {};
      if (startDate) filter.stockInDate.$gte = new Date(startDate);
      if (endDate) filter.stockInDate.$lte = new Date(endDate);
    }

    let sortObj = { createdAt: -1 };
    if (sort) {
      const parts = sort.split(':');
      sortObj = { [parts[0]]: parts[1] === 'asc' ? 1 : -1 };
    }

    const [stockIns, total] = await Promise.all([
      StockIn.find(filter).populate('recordedBy', 'userName').sort(sortObj).skip(skip).limit(limitNum),
      StockIn.countDocuments(filter),
    ]);

    res.json({
      data: stockIns,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

const getStockIn = async (req, res, next) => {
  try {
    const stockIn = await StockIn.findById(req.params.id).populate('recordedBy', 'userName');
    if (!stockIn) {
      return res.status(404).json({ message: 'Stock in record not found' });
    }
    res.json(stockIn);
  } catch (error) {
    next(error);
  }
};

const updateStockIn = async (req, res, next) => {
  try {
    const { itemName, description, quantityIn, supplierName, stockInDate } = req.body;

    const stockIn = await StockIn.findById(req.params.id);
    if (!stockIn) {
      return res.status(404).json({ message: 'Stock in record not found' });
    }

    if (itemName !== undefined) stockIn.itemName = itemName;
    if (description !== undefined) stockIn.description = description;
    if (quantityIn !== undefined) {
      stockIn.quantityIn = quantityIn;
      stockIn.totalQuantityIn = quantityIn;
    }
    if (supplierName !== undefined) stockIn.supplierName = supplierName;
    if (stockInDate !== undefined) stockIn.stockInDate = stockInDate;

    const updated = await stockIn.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteStockIn = async (req, res, next) => {
  try {
    const stockIn = await StockIn.findByIdAndDelete(req.params.id);
    if (!stockIn) {
      return res.status(404).json({ message: 'Stock in record not found' });
    }
    res.json({ message: 'Stock in record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStockIn, getStockIns, getStockIn, updateStockIn, deleteStockIn };
