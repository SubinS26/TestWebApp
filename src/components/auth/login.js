/**
 * @author Subin Shrestha <rtr.shrestha.subin@gmail.com>
 * GitHub repo: https://github.com/SubinS26/TestWebApp
 */

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { FadeIn } from 'animate-components'
import { post } from 'axios'
import Notify from 'handy-notification'
import Title from '../others/title'
import PrimaryButton from '../others/button/primary-btn'

const PRESET_QUICK_USERS = [
  { username: 'superadmin', label: 'SuperAdmin', role: 'Platform Admin' },
  { username: 'steve_jobs', label: 'Steve Jobs', role: 'Creator (Influencer)' },
  { username: 'einstein', label: 'Albert Einstein', role: 'Creator' },
  { username: 'User', label: 'Standard User', role: 'Consumer (Follower)' },
]

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    loading: false,
  }

  handleLogin = async e => {
    e.preventDefault()
    let { username, password } = this.state

    if (!username.trim() || !password.trim()) {
      Notify({ value: 'Please fill in both username and password' })
      return
    }

    this.setState({ loading: true })

    try {
      let { data } = await post('/user/login', {
        username: username.trim(),
        password: password.trim(),
      })

      if (data.success) {
        // Update DOM dataset for SPA persistence
        let dataEl = document.getElementById('data')
        if (dataEl) {
          dataEl.dataset.loggedin = 'true'
          dataEl.dataset.username = username.trim()
        }
        Notify({
          value: `Welcome back, @${username}!`,
          done: () => {
            location.href = '/'
          },
        })
      } else {
        Notify({ value: data.mssg || 'Invalid login credentials' })
        this.setState({ loading: false })
      }
    } catch (err) {
      Notify({ value: 'Connection error during login. Please try again.' })
      this.setState({ loading: false })
    }
  }

  quickSelect = (u, defaultPass) => {
    this.setState({
      username: u,
      password: defaultPass || (u === 'superadmin' ? 'SuperAdmin@1047' : u),
    })
  }

  render() {
    let { username, password, showPassword, loading } = this.state

    return (
      <div className="login_spa_container" style={{ maxWidth: 440, margin: '40px auto 60px', padding: '0 20px' }}>
        <Title value="Login • VideoShare" />

        <FadeIn duration="300ms">
          <div
            style={{
              background: '#fff',
              border: '1px solid #dbdbdb',
              borderRadius: 8,
              padding: '36px 30px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            }}
          >
            {/* Header */}
            <h1
              style={{
                fontFamily: "'Satisfy', cursive",
                fontSize: 34,
                margin: '0 0 20px',
                color: '#262626',
              }}
            >
              Instagram
            </h1>

            <p style={{ fontSize: 14, color: '#8e8e8e', margin: '0 0 24px', lineHeight: 1.4 }}>
              Sign in to share reels, watch video streams, and interact.
            </p>

            {/* Quick Login Shortcuts */}
            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8e8e8e', textTransform: 'uppercase', marginBottom: 8 }}>
                ⚡ Quick Demo Accounts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PRESET_QUICK_USERS.map(u => (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => this.quickSelect(u.username)}
                    style={{
                      background: '#f0f2f5',
                      border: '1px solid #ccd0d5',
                      borderRadius: 14,
                      padding: '4px 10px',
                      fontSize: 12,
                      cursor: 'pointer',
                      color: '#1877f2',
                      fontWeight: 600,
                    }}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={this.handleLogin}>
              <div style={{ marginBottom: 12, textAlign: 'left' }}>
                <input
                  type="text"
                  placeholder="Username or email"
                  value={username}
                  onChange={e => this.setState({ username: e.target.value })}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 4,
                    border: '1px solid #dbdbdb',
                    background: '#fafafa',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 18, position: 'relative', textAlign: 'left' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    paddingRight: 40,
                    borderRadius: 4,
                    border: '1px solid #dbdbdb',
                    background: '#fafafa',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => this.setState({ showPassword: !showPassword })}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8e8e8e',
                    fontSize: 13,
                  }}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              <PrimaryButton
                label={loading ? 'Signing in...' : 'Log In'}
                onClick={this.handleLogin}
                disabled={loading}
                extraClass="login_submit_btn"
                style={{ width: '100%', padding: '10px', fontSize: 14, fontWeight: 700 }}
              />
            </form>

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #efefef', fontSize: 14, color: '#262626' }}>
              Don't have an account?{' '}
              <NavLink to="/signup" style={{ color: '#0095f6', fontWeight: 600, textDecoration: 'none' }}>
                Sign up
              </NavLink>
            </div>
          </div>
        </FadeIn>
      </div>
    )
  }
}
