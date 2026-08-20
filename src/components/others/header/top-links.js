import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { uData } from '../../../utils/utils'
import MaterialIcon from '../icons/material-icon'
import PostIt from '../../post/post-it/post-it'

export default class HeaderTopLinks extends Component {
  state = {
    postIt: false,
  }

  togglePostIt = e => {
    e ? e.preventDefault() : null
    this.setState({ postIt: !this.state.postIt })
  }

  render() {
    let { postIt } = this.state
    let id = uData('session')
    let username = uData('username')

    return (
      <Fragment>
        <a
          href="#"
          className="notification"
          onClick={this.togglePostIt}
          style={{ cursor: 'pointer' }}
        >
          <span className="notification_span nav_icon">
            <MaterialIcon icon="add_box" />
          </span>
          <span className="links_span">Create Post</span>
        </a>

        <NavLink
          to="/notifications"
          activeClassName="ha_active"
          className="notification"
        >
          <span className="notification_span nav_icon">
            <MaterialIcon icon="notifications_none" />
          </span>
          <span className="links_span">Notifications</span>
        </NavLink>

        <NavLink
          to={`/profile/${username}`}
          activeClassName="ha_active"
          className="sp"
        >
          <img src={`/users/${id}/avatar.jpg`} alt="avatar" className="sp_img" />
          <span className="sp_span">{username}</span>
        </NavLink>

        {postIt ? (
          <PostIt back={this.togglePostIt} type="user" />
        ) : null}
      </Fragment>
    )
  }
}

