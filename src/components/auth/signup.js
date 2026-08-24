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

export default class Signup extends Component {
  state = {
    username: '',
    firstname: '',
    surname: '',
    email: '',
    password: '',
    agreedTerms: true,
    loading: false,
  }

  handleSignup = async e => {
    e.preventDefault()
    let { username, firstname, surname, email, password, agreedTerms } = this.state

    if (!username || !firstname || !surname || !email || !password) {
      Notify({ value: 'Please fill in all required fields' })
      return
    }

    if (!agreedTerms) {
      Notify({ value: 'Please agree to the Terms of Service' })
      return
    }

    this.setState({ loading: true })

    try {
      let { data } = await post('/user/signup', {
        username: username.trim(),
        firstname: firstname.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: password.trim(),
      })

      if (data.success) {
        let dataEl = document.getElementById('data')
        if (dataEl) {
          dataEl.dataset.loggedin = 'true'
          dataEl.dataset.username = username.trim()
        }
        Notify({
          value: `🎉 Welcome @${username}! Let's set up your profile.`,
          done: () => {
            location.href = '/create-profile'
          },
        })
      } else {
        let errMssg = Array.isArray(data.mssg) ? data.mssg.join(', ') : data.mssg
        Notify({ value: errMssg || 'Registration failed' })
        this.setState({ loading: false })
      }
    } catch (err) {
      Notify({ value: 'Connection error during signup' })
      this.setState({ loading: false })
    }
  }

  render() {
    let { username, firstname, surname, email, password, agreedTerms, loading } = this.state

    return (
      <div className="signup_spa_container" style={{ maxWidth: 440, margin: '40px auto 60px', padding: '0 20px' }}>
        <Title value="Sign Up • VideoShare" />

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
                margin: '0 0 12px',
                color: '#262626',
              }}
            >
              Instagram
            </h1>

            <p style={{ fontSize: 14, color: '#8e8e8e', margin: '0 0 24px', lineHeight: 1.4, fontWeight: 600 }}>
              Sign up to see reels, photos, and videos from your friends.
            </p>

            {/* Signup Form */}
            <form onSubmit={this.handleSignup}>
              <div style={{ marginBottom: 10 }}>
                <input
                  type="text"
                  placeholder="Username"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstname}
                  onChange={e => this.setState({ firstname: e.target.value })}
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
                <input
                  type="text"
                  placeholder="Last Name"
                  value={surname}
                  onChange={e => this.setState({ surname: e.target.value })}
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

              <div style={{ marginBottom: 10 }}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => this.setState({ email: e.target.value })}
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

              <div style={{ marginBottom: 14 }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
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

              <div style={{ marginBottom: 18, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="agreedTerms"
                  checked={agreedTerms}
                  onChange={e => this.setState({ agreedTerms: e.target.checked })}
                />
                <label htmlFor="agreedTerms" style={{ fontSize: 12, color: '#8e8e8e' }}>
                  I agree to the Terms of Service & Privacy Policy.
                </label>
              </div>

              <PrimaryButton
                label={loading ? 'Creating Account...' : 'Sign Up For Free'}
                onClick={this.handleSignup}
                disabled={loading}
                style={{ width: '100%', padding: '10px', fontSize: 14, fontWeight: 700 }}
              />
            </form>

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #efefef', fontSize: 14, color: '#262626' }}>
              Have an account?{' '}
              <NavLink to="/login" style={{ color: '#0095f6', fontWeight: 600, textDecoration: 'none' }}>
                Log in
              </NavLink>
            </div>
          </div>
        </FadeIn>
      </div>
    )
  }
}
