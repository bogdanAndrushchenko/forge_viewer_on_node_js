const express = require('express');
const multer = require('multer');

const {getClient, getInternalToken} = require('./common/oauth');
const {
    getBucketController,
    createBucketController, uploadController
} = require('../controllers/oss_controllers')

const router = express.Router();

// middleware
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

router.get('./buckets', getBucketController)
    .post('./buckets', createBucketController);

router.post('/object', multer({dest: 'uploads/'}).single('fileToUpload'), uploadController);

module.exports = router;