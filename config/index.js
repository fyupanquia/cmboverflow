'use strict'
require('dotenv').config()

const patchcert = (cert) => {
    let str ='';
    let chunks = cert.split('\\n')
    for (let index = 0; index < chunks.length; index++) {
        const chunk = chunks[index];
        str += chunk+"\n";
    }
    //console.log(str);
    return str
}

const config = {
  env: process.env.ENV,
  databaseURL: process.env.databaseURL,
  firebase: {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: patchcert(process.env.private_key),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
  },
};

module.exports = {
    config
}