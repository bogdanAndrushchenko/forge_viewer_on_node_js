const express = require('express');
const multer = require('multer');

const {getToken} = require('./middlewares/get_token');
const {
    getBucketController,
    createBucketController, uploadController
} = require('../controllers/oss_controllers')

const router = express.Router();

// middleware
router.use(getToken);

router.get('./buckets', getBucketController)
    .post('./buckets', createBucketController);

router.post('/object', multer({dest: 'uploads/'}).single('fileToUpload'), uploadController);

module.exports = router;