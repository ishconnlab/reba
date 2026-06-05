const express = require('express');
const { body } = require('express-validator');
const {
  createStockOut,
  getStockOuts,
  getStockOut,
  updateStockOut,
  deleteStockOut,
} = require('../controllers/stockOutController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('itemName').notEmpty().withMessage('Item name is required'),
    body('quantityOut').isInt({ min: 1 }).withMessage('Quantity must be greater than 0'),
  ],
  validate,
  createStockOut
);

router.get('/', getStockOuts);
router.get('/:id', getStockOut);
router.put('/:id', updateStockOut);
router.delete('/:id', deleteStockOut);

module.exports = router;
