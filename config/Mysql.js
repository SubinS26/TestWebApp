// RETURNS MYSQL DATABASE

require('dotenv').config()

const mysql = require('mysql'),
  { error } = require('handy-log'),
  { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_SOCKET } = process.env

const connectionConfig = {
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

// CREATES A DB CONNECTION
const db = mysql.createConnection(connectionConfig)

// CONNECTS DB
db.connect(err => {
  if (err) {
    error(err.message)
  }
})

module.exports = db
