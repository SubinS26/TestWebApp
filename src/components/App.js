/**
 * @author Subin Shrestha <rtr.shrestha.subin@gmail.com>
 * GitHub repo: https://github.com/SubinS26/TestWebApp
 */

import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUnreadNotifications } from '../actions/notification'
import { getUnreadMessages } from '../actions/message'

import Header from './others/header/header'
import NotiSpeak from './others/noti-speak'
import SideBar from './others/sidebar/sidebar'
import AppRoutes from './App-routes'
import { uData } from '../utils/utils'

class App extends Component {
  componentDidMount = () => {
    let { dispatch } = this.props
    let isLoggedIn = uData('loggedin') === 'true'
    if (isLoggedIn) {
      dispatch(getUnreadNotifications())
      dispatch(getUnreadMessages())
    }
  }

  render() {
    let { unreadNotifications, unreadMessages } = this.props
    let isLoggedIn = uData('loggedin') === 'true'

    return (
      <Router>
        <div className="app">
          {isLoggedIn ? (
            <React.Fragment>
              <Header />
              <NotiSpeak un={unreadNotifications} />
              <SideBar un={unreadNotifications} uc={unreadMessages} />
            </React.Fragment>
          ) : null}
          <AppRoutes />
        </div>
      </Router>
    )
  }
}

const mapStateToProps = store => ({
  unreadNotifications: store.Notification.unreadNotifications,
  unreadMessages: store.Message.unreadMessages,
})

export default connect(mapStateToProps)(App)
export { App as PureApp }
