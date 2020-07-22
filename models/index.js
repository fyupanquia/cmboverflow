'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('../config/serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://local-vue-ex.firebaseio.com'
})

const db = admin.database()

const Users = require('./users')
const Questions = require("./questions");

module.exports = {
  users: new Users(db),
  questions: new Questions(db),
};
