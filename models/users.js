'use strict'

const bcrypt = require('bcrypt')

const Users = (db) => {

    let collection = db.ref('/').ref.child('users')

  const create = async  (data) => {
    const user = {
      ...data
    }
    user.password = await encrypt(data.password)
    const newUser = collection.push()
    newUser.set(user)

    return newUser.key
  }

  const validateUser = async  (data) => {
    const userQuery = await collection
      .orderByChild('email')
      .equalTo(data.email)
      .once('value')
    const userFound = userQuery.val()
    if (userFound) {
      const userId = Object.keys(userFound)[0]
      const passwdRight = await bcrypt.compare(
        data.password,
        userFound[userId].password
      )
      const result = passwdRight ? userFound[userId] : false

      return result
    }

    return false
  }

  const encrypt = async  (passwd) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(passwd, saltRounds)
    return hashedPassword
  }

  return {
    create,
    validateUser,
    encrypt,
  };
}

module.exports = Users
