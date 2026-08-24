/**
 * @author Subin Shrestha <rtr.shrestha.subin@gmail.com>
 * GitHub repo: https://github.com/SubinS26/TestWebApp
 */

// FOR LOGGEDIN USER
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import store from './store/store'
import App from './components/App'

const API_ORIGIN =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1' &&
  !window.location.hostname.includes('azurewebsites.net')
    ? 'https://cw2-videoshare-api-arbuhrh8ghcgghgz.italynorth-01.azurewebsites.net'
    : ''

if (typeof window !== 'undefined') {
  if (API_ORIGIN) {
    axios.defaults.baseURL = API_ORIGIN
  }
  axios.defaults.withCredentials = true
}

let element = document.getElementById('root')
if (element) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    element
  )
} else {
  // USER SYSTEM (FOR NOT-LOGGEDIN USER)
  require('./user-system/user-system')
}
