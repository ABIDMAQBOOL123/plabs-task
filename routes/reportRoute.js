const express = require('express');
const reportController = require('../controllers/reportController');
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/',authMiddleware, reportController.generateReport);

module.exports = router;