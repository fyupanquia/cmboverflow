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
  env: process.env.ENV || 'prd',
  databaseURL: process.env.overflow_databaseURL,
  firebase: {
    type: process.env.overflow_type,
    project_id: process.env.overflow_project_id,
    private_key_id: process.env.overflow_private_key_id,
    private_key: patchcert(process.env.overflow_private_key),
    client_email: process.env.overflow_client_email,
    client_id: process.env.overflow_client_id,
    auth_uri: process.env.overflow_auth_uri,
    token_uri: process.env.overflow_token_uri,
    auth_provider_x509_cert_url:
      process.env.overflow_auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.overflow_client_x509_cert_url,
  },
};

module.exports = {
    config
}