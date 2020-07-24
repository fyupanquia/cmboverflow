'use strict'

const admin = require('firebase-admin')
const {config} = require("../config")

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
  databaseURL: config.databaseURL,
});

const db = admin.database()

const Users = require('./users')
const Questions = require("./questions");

module.exports = {
  users: Users(db),
  questions: Questions(db),
};
