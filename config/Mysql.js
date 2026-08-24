// RETURNS MYSQL DATABASE POOL

require('dotenv').config()

const mysql = require('mysql'),
  { error, success } = require('handy-log'),
  { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_SOCKET, MYSQL_SSL } = process.env

const connectionConfig = {
  connectionLimit: 10,
  user: MYSQL_USER || 'root',
  password: MYSQL_PASSWORD || '',
  database: MYSQL_DATABASE || 'react-instagram-clone',
  charset: 'utf8mb4',
}

if (MYSQL_SOCKET) {
  connectionConfig.socketPath = MYSQL_SOCKET
} else {
  connectionConfig.host = MYSQL_HOST || '127.0.0.1'
  if (MYSQL_PORT) {
    connectionConfig.port = Number(MYSQL_PORT)
  }
}

// Enable SSL if MYSQL_SSL is explicitly set to true
if (MYSQL_SSL === 'true' || MYSQL_SSL === '1') {
  connectionConfig.ssl = {
    rejectUnauthorized: false,
  }
}

// CREATES A DB CONNECTION POOL
const db = mysql.createPool(connectionConfig)

// TEST DB CONNECTION
db.getConnection((err, connection) => {
  if (err) {
    error(`[MySQL] Initial connection warning: ${err.message}`)
  } else {
    success(`[MySQL] Connection established to ${connectionConfig.host || 'local socket'}/${connectionConfig.database}`)
    connection.release()
  }
})

module.exports = db
