const express = require('express');
const { getDailyStockStatus, getDateRangeReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/daily-stock-status', getDailyStockStatus);
router.get('/date-range', getDateRangeReport);

module.exports = router;
