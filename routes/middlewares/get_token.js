const {getClient, getInternalToken} = require('../common/oauth');

const getToken = async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
};

module.exports = {getToken};