// routes/actuatorRoutes.js
const express = require('express');
const actuatorController = require('../controllers/actuatorController');
const router = express.Router();

router.get('/', actuatorController.globalStatus);

module.exports = router;
