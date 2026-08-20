// ALL THE ADMIN-RELATED ROUTES ARE HANDLED BY THIS FILE

const app = require('express').Router()

// CHECKS IF USER US ADMIN [REQ = PASSWORD]
app.post('/check-is-admin', async (req, res) => {
  let { password } = req.body,
    { ADMIN_PASSWORD } = process.env

  if (req.session.username === 'superadmin') {
    const db = require('../../../config/db')
    const bcrypt = require('bcrypt-nodejs')
    try {
      let users = await db.query('SELECT password FROM users WHERE username="superadmin" LIMIT 1')
      if (users && users.length > 0) {
        const isUserPass = bcrypt.compareSync(password, users[0].password)
        const isGlobalPass = (password == ADMIN_PASSWORD)

        if (isUserPass || isGlobalPass) {
          req.session.isadmin = true
          return res.json({
            mssg: 'Hello admin!!',
            success: true,
          })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (password != ADMIN_PASSWORD) {
    res.json({ mssg: 'Wrong password!!' })
  } else {
    req.session.isadmin = true
    res.json({
      mssg: 'Hello admin!!',
      success: true,
    })
  }
})

// ADMIN LOGOUT
app.post('/admin-logout', async (req, res) => {
  req.session.isadmin = false
  res.json('Hello, World!!')
})

module.exports = app
