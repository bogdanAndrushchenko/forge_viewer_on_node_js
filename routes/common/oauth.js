const {AuthClientTwoLegged} = require('forge-apis');

const config = require('../../config');

const getClient = (scopes) => {
    const {client_id, client_secret} = config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal)
}

const cache = new Map();

const getToken = async (scopes) => {
    const key = scopes.join('+');
    if (cache.has(key) && cache.get(key).expires_at > Date.now()) {
        return cache.get(key)
    }

    const client = getClient(scopes);
    let credentials = await client.authenticate();
    credentials.expires_at = Date.now() + credentials.expires_in * 1000;
    cache.set(key, credentials);
    return credentials
}

const getPublicToken = async _ => getToken(config.scopes.public);
const getInternalToken = async _ => getToken(config.scopes.internal);

module.exports = {
    getClient, getPublicToken, getInternalToken
}