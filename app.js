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
  fs = require('fs'),
  { join } = require('path'),
  hbs = require('express-handlebars'),
  bodyParser = require('body-parser'),
  validator = require('express-validator'),
  session = require('client-sessions'),
  cookieParser = require('cookie-parser'),
  compression = require('compression')

// Project Files
const { variables } = require('./config/Middlewares')
const AppRoutes = require('./app-routes')

// Trust proxy for Azure App Service & reverse proxies
app.set('trust proxy', 1)

// Enable gzip/deflate compression for fast asset and payload delivery
app.use(compression())

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

// CORS support for Azure Static Web Apps and cross-origin frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://ashy-flower-06eb54810.7.azurestaticapps.net',
    'https://videoshare-frontend.azurestaticapps.net',
    'http://localhost:3000',
    'http://localhost:4300',
    'http://localhost:8080',
    'http://127.0.0.1:4280', // Azure SWA CLI emulator
  ]
  const origin = req.headers.origin
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.azurestaticapps.net') || origin.endsWith('.azurewebsites.net'))) {
    res.header('Access-Control-Allow-Origin', origin)
  } else {
    res.header('Access-Control-Allow-Origin', '*')
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Middlewares
app.use(favicon(join(__dirname, '/dist/images/favicon/favicon.png')))
app.use(bodyParser.json({ limit: '150mb' }))
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '150mb',
  })
)
app.use(validator())
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https' || req.secure || req.protocol === 'https') {
    if (req.connection) {
      req.connection.proxySecure = true
    }
  }
  next()
})

app.use(
  session({
    cookieName: 'session',
    secret: sessionSecret,
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    cookie: {
      ephemeral: false,
      httpOnly: true,
      secure: false, // Allows session cookies under Azure TLS termination without socket strictness
    },
  })
)
app.use(cookieParser())
app.use(
  express.static(join(__dirname, '/dist'), {
    index: false,
    maxAge: '30d',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.js') || path.endsWith('.css')) {
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable')
      } else if (/\.(jpg|jpeg|png|gif|mp4|webm|svg|ico|woff|woff2|ttf)$/i.test(path)) {
        res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400')
      }
    },
  })
)

// Middleware for some local variables to be used in the template
app.use(variables)

// Direct media route with Azure Blob storage fallback
app.get('/posts/:filename', (req, res) => {
  const filePath = join(__dirname, 'dist/posts', req.params.filename)
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath)
  }
  const blobUrl = `https://cw2videostorage01.blob.core.windows.net/posts/${req.params.filename}`
  res.redirect(blobUrl)
})

// App routes
AppRoutes(app)

// Listening to PORT
app.listen(port, () => success(`App running on port ${port}..`))
