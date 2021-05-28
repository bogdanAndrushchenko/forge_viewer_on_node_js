const fs = require('fs');
const {BucketsApi, ObjectsApi, PostBucketsPayload} = require('forge-apis');
const config = require('../config');


const getBucketController = async (req, res, next) => {
    const bucket_name = req.query.id;
    if (!bucket_name || bucket_name === '#') {
        try {
            const buckets = await new BucketsApi().getBuckets({limit: 100}, req.oauth_client, req.oauth_token);
            res.json(buckets.body.items.map((bucket) => {
                return {
                    id: bucket.bucketKey,
                    text: bucket.bucketKey.replace(`${config.credentials.client_id.toLowerCase()}-`, ' '),
                    type: 'bucket',
                    children: true,
                }
            }));
        } catch (err) {
            next(err)
        }
    } else {
        try {
            const objects = await new ObjectsApi().getObjects(bucket_name, {limit: 100}, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((obj) => {
                return {
                    id: Buffer.from(obj.objectid).toString('base64'),
                    text: obj.objectKey,
                    type: 'object',
                    children: false
                }
            }))
        } catch (err) {
            next(err)
        }
    }
};

const createBucketController = async (req, res, next) => {
    const payload = new PostBucketsPayload();
    payload.bucketKey = `${config.credentials.client_id.toLowerCase()}-${req.body.bucketKey}`;
    payload.policyKey = 'transient'
    try {
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch (err) {
        next(err);
    }
};

const uploadController = async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) next(err);
        try {
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            res.status(200).end();
        } catch (err) {
            next(err)
        }
    })
}

module.exports = {
    getBucketController, createBucketController, uploadController,
}