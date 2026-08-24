import React from 'react'
import ProfileNavLink from '../others/profile-navlink'
import PropTypes from 'prop-types'
import { Me, uData } from '../../utils/utils'
import classNames from 'classnames'

const ProfileNav = ({ url, user }) => {
  let username = uData('username')
  return (
    <div
      className={classNames('pro_nav', 'user_nav', { not_me_nav: !Me(user) })}
    >
      <ul>
        <ProfileNavLink url={url} label="Posts" />
        <ProfileNavLink url={`${url}/tagged`} label="Tagged" />
        <ProfileNavLink url={`${url}/shared`} label="Shared" />
        <ProfileNavLink url={`${url}/gallery`} label="Gallery" />
        {Me(user) && (
          <ProfileNavLink url={`${url}/bookmarks`} label="Bookmarks" />
        )}
        <ProfileNavLink url={`${url}/groups`} label="Groups" />
        <ProfileNavLink url={`${url}/about`} label="About" />
        {Me(user) && username && username.toLowerCase() === 'superadmin' && (
          <ProfileNavLink url={`${url}/manage-users`} label="Manage Users" />
        )}
      </ul>
    </div>
  )
}


ProfileNav.propTypes = {
  url: PropTypes.string.isRequired,
  user: PropTypes.number,
}

export default ProfileNav
