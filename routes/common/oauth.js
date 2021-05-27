const {AuthClientTwoLegged} = require('forge-apis');

const config = require('../../config');

const getClient = (scopes) =>{
    const {client_id,client_secret}=config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret , scopes || config.scopes.internal)
}

const cache = new Map()