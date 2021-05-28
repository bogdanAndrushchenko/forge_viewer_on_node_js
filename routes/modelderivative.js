const express = require('express');

const {getToken} = require('./common/get_token');
const {translateController} = require('../controllers/modelderivative_controllers');

const router = express.Router();

// middleware
router.use(getToken);

router.post('/jobs', translateController);

module.exports = router;