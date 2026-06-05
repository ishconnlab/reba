const express = require('express');
const { body } = require('express-validator');
const {
  createStockIn,
  getStockIns,
  getStockIn,
  updateStockIn,
  deleteStockIn,
} = require('../controllers/stockInController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('itemName').notEmpty().withMessage('Item name is required'),
    body('quantityIn').isInt({ min: 1 }).withMessage('Quantity must be greater than 0'),
    body('supplierName').notEmpty().withMessage('Supplier name is required'),
  ],
  validate,
  createStockIn
);

router.get('/', getStockIns);
router.get('/:id', getStockIn);
router.put('/:id', updateStockIn);
router.delete('/:id', deleteStockIn);

module.exports = router;
