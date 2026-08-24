/**
 * @author Subin Shrestha <rtr.shrestha.subin@gmail.com>
 * GitHub repo: https://github.com/SubinS26/TestWebApp
 */

import React from 'react'
import { NavLink } from 'react-router-dom'
import Title from '../others/title'

const Welcome = () => {
  return (
    <div>
      <Title value="Welcome • Instagram" />

      <div className="index_header">
        <div className="header_logo nh_logo">
          <img src="/images/instagram.jpg" alt="Instagram" />
          <hr />
          <span>Instagram</span>
        </div>
        <div className="right">
          <NavLink to="/welcome">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/developer">Developer</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </div>
      </div>

      <div className="notes_wrapper">
        <div className="welcome_div" style={{ textAlign: 'center', marginTop: 10 }}>
          <NavLink to="/login" style={{ display: 'inline-block' }}>
            <img
              src="/images/HomePageImg.png"
              alt="Home Page Image"
              style={{
                width: '85%',
                maxWidth: 950,
                height: 'auto',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              }}
            />
          </NavLink>
          <div style={{ marginTop: 25 }}>
            <NavLink
              to="/login"
              className="pri_btn"
              style={{
                padding: '10px 28px',
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Discover More &rarr;
            </NavLink>
          </div>
        </div>
      </div>

      <div className="github-stats">
        <iframe
          src="https://ghbtns.com/github-btn.html?user=SubinS26&type=follow&count=false&size=large"
          frameBorder="0"
          scrolling="0"
          width="180px"
          height="30px"
        />
      </div>
    </div>
  )
}

export default Welcome
