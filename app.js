// MAIN ENTRY OF OUR APP

// Initializes dotenv
require('dotenv').config()

// Require Dependencies
const express = require('express'),
  app = express(),
  port = process.env.PORT || 4300,
  sessionSecret = process.env.SESSION_SECRET_LETTER || 'azure-app-default-session-secret-key-1234',
  { success } = require('handy-log'),
  favicon = require('serve-favicon'),
  { join } = require('path'),
  hbs = require('express-handlebars'),
  bodyParser = require('body-parser'),
  validator = require('express-validator'),
  session = require('client-sessions'),
  cookieParser = require('cookie-parser')

// Project Files
const { variables } = require('./config/Middlewares')
const AppRoutes = require('./app-routes')

// Trust proxy for Azure App Service & reverse proxies
app.set('trust proxy', 1)

// View engine
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: false,
  })
)
app.set('view engine', 'hbs')

// Azure health probe endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() })
})

// Middlewares
app.use(favicon(join(__dirname, '/dist/images/favicon/favicon.png')))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(validator())
app.use(express.static(join(__dirname, '/dist')))
app.use(
  session({
    cookieName: 'session',
    secret: sessionSecret,
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  })
)
app.use(cookieParser())

// Middleware for some local variables to be used in the template
app.use(variables)

// App routes
AppRoutes(app)

// Listening to PORT
app.listen(port, () => success(`App running on port ${port}..`))
