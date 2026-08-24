/**
 * Script to initialize database tables and seed data on Azure MySQL Flexible Server
 * Usage: node scripts/init-azure-db.js
 */

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

const {
  MYSQL_HOST = '127.0.0.1',
  MYSQL_PORT = 3306,
  MYSQL_USER = 'root',
  MYSQL_PASSWORD = '',
  MYSQL_DATABASE = 'react-instagram-clone',
  MYSQL_SSL,
} = process.env

const isAzure = MYSQL_HOST && MYSQL_HOST.includes('.azure.com')
const sslConfig =
  MYSQL_SSL === 'true' || MYSQL_SSL === '1' || isAzure
    ? { rejectUnauthorized: false }
    : false

console.log(`[Init-DB] Connecting to MySQL at ${MYSQL_HOST}:${MYSQL_PORT} (DB: ${MYSQL_DATABASE})...`)

const connection = mysql.createConnection({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  multipleStatements: true,
  ssl: sslConfig,
})

connection.connect(err => {
  if (err) {
    console.error(`[Init-DB] Connection failed:`, err.message)
    process.exit(1)
  }

  console.log(`[Init-DB] Connected successfully!`)
  const sqlFile = path.join(__dirname, '..', 'db.sql')

  if (!fs.existsSync(sqlFile)) {
    console.error(`[Init-DB] db.sql not found at ${sqlFile}`)
    connection.end()
    process.exit(1)
  }

  const sqlContent = fs.readFileSync(sqlFile, 'utf8')
  console.log(`[Init-DB] Executing db.sql script...`)

  connection.query(sqlContent, (err, results) => {
    if (err) {
      console.error(`[Init-DB] Error executing SQL:`, err.message)
    } else {
      console.log(`[Init-DB] Database schema and initial data loaded successfully!`)
    }
    connection.end()
  })
})
