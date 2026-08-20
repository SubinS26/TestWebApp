const app = require('express').Router()
const db = require('../../../config/db')
const User = require('../../../config/User')
const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const rmdir = promisify(fs.rmdir)
const root = process.cwd()

// Middleware to check if user is superadmin
const isSuperAdmin = (req, res, next) => {
  if (req.session && req.session.username && req.session.username.toLowerCase() === 'superadmin') {
    next()
  } else {
    res.json({ success: false, mssg: 'Unauthorized' })
  }
}

// Get all users
app.get('/superadmin/get-users', isSuperAdmin, async (req, res) => {
  try {
    const users = await db.query('SELECT id, username, email, firstname, surname, is_active FROM users WHERE LOWER(username) != "superadmin" ORDER BY id DESC')
    res.json({ success: true, users })
  } catch (error) {
    db.catchError(error, res)
  }
})

// Toggle user activation status
app.post('/superadmin/toggle-activation', isSuperAdmin, async (req, res) => {
  try {
    const { id, is_active } = req.body
    
    // Safeguard: make sure superadmin cannot be deactivated
    let [{ username }] = await db.query('SELECT username FROM users WHERE id=?', [id])
    if (username && username.toLowerCase() === 'superadmin') {
      return res.json({ success: false, mssg: 'You cannot deactivate the superadmin account!' })
    }

    if (is_active !== 'yes' && is_active !== 'no') {
      return res.json({ success: false, mssg: 'Invalid status value!' })
    }

    await db.query('UPDATE users SET is_active=? WHERE id=?', [is_active, id])
    res.json({ success: true, mssg: `User account ${is_active === 'yes' ? 'activated' : 'deactivated'} successfully!` })
  } catch (error) {
    db.catchError(error, res)
  }
})

// Create user
app.post('/superadmin/create-user', isSuperAdmin, async (req, res) => {
  try {
    const { username, firstname, surname, email, password } = req.body
    
    // Check if exists
    let [{ usernameCount }] = await db.query('SELECT COUNT(username) as usernameCount from users WHERE username=?', [username])
    let [{ emailCount }] = await db.query('SELECT COUNT(email) as emailCount from users WHERE email=?', [email])

    if (usernameCount == 1) {
      return res.json({ success: false, mssg: 'Username already exists!!' })
    }
    if (emailCount == 1) {
      return res.json({ success: false, mssg: 'Email already exists!!' })
    }

    const hash = bcrypt.hashSync(password)
    const newUser = {
      username,
      firstname,
      surname,
      email,
      password: hash,
      joined: new Date().getTime(),
      email_verified: 'yes',
      isOnline: 'no',
      bio: '', instagram: '', twitter: '', facebook: '', github: '', website: '', phone: '', lastOnline: ''
    }

    let { insertId } = await db.query('INSERT INTO users SET ?', newUser)
    
    // Copy avatar
    const userDir = path.join(root, 'dist', 'users', String(insertId))
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }
    fs.copyFileSync(
      path.join(root, 'dist', 'images', 'spacecraft.jpg'),
      path.join(userDir, 'avatar.jpg')
    )

    res.json({ success: true, mssg: 'User created successfully!' })
  } catch (error) {
    db.catchError(error, res)
  }
})

// Reset password
app.post('/superadmin/reset-password', isSuperAdmin, async (req, res) => {
  try {
    const { username, password } = req.body
    const userId = await User.getId(username)
    if (!userId) {
      return res.json({ success: false, mssg: 'User not found!' })
    }
    const hash = bcrypt.hashSync(password)
    await db.query('UPDATE users SET password=? WHERE id=?', [hash, userId])
    res.json({ success: true, mssg: 'Password reset successfully!' })
  } catch (error) {
    db.catchError(error, res)
  }
})

// Delete user account
app.post('/superadmin/delete-user', isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.body
    if (!id) {
      return res.json({ success: false, mssg: 'User ID is required!' })
    }

    // Safeguard: make sure superadmin cannot be deleted
    let [{ username }] = await db.query('SELECT username FROM users WHERE id=?', [id])
    if (username && username.toLowerCase() === 'superadmin') {
      return res.json({ success: false, mssg: 'You cannot delete the superadmin account!' })
    }

    await User.deactivate(id, req, res)

    res.json({ success: true, mssg: 'User account deleted successfully!' })
  } catch (error) {
    db.catchError(error, res)
  }
})

// Update user details
app.post('/superadmin/update-user', isSuperAdmin, async (req, res) => {
  try {
    const { id, username, firstname, surname, email } = req.body
    
    // Check if new username/email belongs to another user
    let [{ usernameCount }] = await db.query('SELECT COUNT(username) as usernameCount from users WHERE LOWER(username)=LOWER(?) AND id != ?', [username, id])
    let [{ emailCount }] = await db.query('SELECT COUNT(email) as emailCount from users WHERE LOWER(email)=LOWER(?) AND id != ?', [email, id])

    if (usernameCount == 1) {
      return res.json({ success: false, mssg: 'Username already exists!!' })
    }
    if (emailCount == 1) {
      return res.json({ success: false, mssg: 'Email already exists!!' })
    }

    await db.query('UPDATE users SET username=?, firstname=?, surname=?, email=? WHERE id=?', [
      username, firstname, surname, email, id
    ])
    res.json({ success: true, mssg: 'User details updated successfully!' })
  } catch (error) {
    db.catchError(error, res)
  }
})

module.exports = app
