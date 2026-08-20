import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const getSidebarIcon = (label) => {
  if (!label) return 'far fa-circle'
  const lower = label.toLowerCase().trim()
  if (lower.startsWith('@')) return 'far fa-user-circle'
  if (lower.includes('edit')) return 'far fa-edit'
  if (lower.includes('manage') || lower.includes('users')) return 'fas fa-user-shield'
  if (lower.includes('home')) return 'fas fa-home'
  if (lower.includes('explore')) return 'far fa-compass'
  if (lower.includes('notification')) return 'far fa-heart'
  if (lower.includes('message')) return 'far fa-paper-plane'
  if (lower.includes('bookmark')) return 'far fa-bookmark'
  if (lower.includes('gallery')) return 'far fa-images'
  if (lower.includes('favourite')) return 'far fa-star'
  if (lower.includes('group')) return 'fas fa-users'
  if (lower.includes('recommendation')) return 'far fa-thumbs-up'
  if (lower.includes('setting')) return 'fas fa-cog'
  return 'far fa-circle'
}

const SidebarLink = ({ label, link, showNumbers, numbers }) => {
  const iconClass = getSidebarIcon(label)

  return (
    <li className="m_n_li">
      <NavLink
        to={link}
        exact
        activeClassName="sidebar_active"
        className="m_n_a"
      >
        <span className="m_n_icon">
          <i className={iconClass} />
        </span>
        <span className="m_n_text">{label}</span>
        {showNumbers && numbers ? (
          <span className="m_n_new">{numbers > 9 ? '+' : numbers}</span>
        ) : null}
      </NavLink>
    </li>
  )
}

SidebarLink.defaultProps = {
  showNumbers: false,
  numbers: 0,
}

SidebarLink.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  showNumbers: PropTypes.bool,
  numbers: PropTypes.number,
}

export default SidebarLink
