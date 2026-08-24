/**
 * @author Subin Shrestha <rtr.shrestha.subin@gmail.com>
 * GitHub repo: https://github.com/SubinS26/TestWebApp
 */

import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import { uData } from '../../utils/utils'

const Welcome = () => {
  let isLoggedIn = uData('loggedin') === 'true'
  let username = uData('username')

  return (
    <div className="welcome_page_container" style={{ width: '100%', maxWidth: 1080, margin: '20px auto 60px', padding: '0 20px' }}>
      <Title value="Welcome to VideoShare • Instagram Reels Cloud Platform" />

      <FadeIn duration="400ms">
        {/* HERO SECTION */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1877f2 0%, #00c6ff 100%)',
            borderRadius: 16,
            padding: '40px 30px',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(24, 119, 242, 0.25)',
            marginBottom: 35,
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 30, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            <span>☁️ Microsoft Azure PaaS Architecture</span>
            <span>•</span>
            <span>COM769 Cloud-Native</span>
          </div>

          <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Next-Gen Video Sharing & Social Platform
          </h1>
          <p style={{ margin: '0 auto 28px', maxWidth: 680, fontSize: 16, opacity: 0.95, lineHeight: 1.6 }}>
            Share short-form video reels, connect with creators, discover trending media, and experience real-time AI cognitive sentiment analysis hosted on Microsoft Azure.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            {isLoggedIn ? (
              <NavLink
                to={`/profile/${username}`}
                className="pri_btn"
                style={{
                  background: '#fff',
                  color: '#1877f2',
                  padding: '12px 28px',
                  borderRadius: 30,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              >
                Go to My Profile (@{username}) &rarr;
              </NavLink>
            ) : (
              <Fragment>
                <a
                  href="/login"
                  style={{
                    background: '#fff',
                    color: '#1877f2',
                    padding: '12px 28px',
                    borderRadius: 30,
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  }}
                >
                  🚀 Login to Continue
                </a>
                <a
                  href="/signup"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.8)',
                    padding: '10px 26px',
                    borderRadius: 30,
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: 'none',
                  }}
                >
                  Create Free Account
                </a>
              </Fragment>
            )}

            <NavLink
              to="/explore"
              style={{
                background: 'rgba(0,0,0,0.15)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: 30,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              Explore Feed &rarr;
            </NavLink>
          </div>
        </div>

        {/* HERO IMAGE SHOWCASE */}
        <div style={{ textAlign: 'center', marginBottom: 45 }}>
          <a href="/login" style={{ display: 'inline-block', maxWidth: '100%' }}>
            <img
              src="/images/HomePageImg.png"
              alt="VideoShare Home Page Preview"
              style={{
                width: '100%',
                maxWidth: 960,
                height: 'auto',
                borderRadius: 12,
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                border: '1px solid #e1e8ed',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
              }}
            />
          </a>
        </div>

        {/* CLOUD FEATURES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: 12, border: '1px solid #e1e8ed', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎥</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#1c1e21' }}>Instagram Reels & Videos</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#65676b', lineHeight: 1.5 }}>
              Upload, tag, stream, and interact with high-definition short-form reels with custom metadata tracking.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: 12, border: '1px solid #e1e8ed', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#1c1e21' }}>Cognitive Sentiment Engine</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#65676b', lineHeight: 1.5 }}>
              Real-time NLP sentiment interception analyzing comment polarity before database persistence.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: 12, border: '1px solid #e1e8ed', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>☁️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#1c1e21' }}>Azure Blob Object Storage</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#65676b', lineHeight: 1.5 }}>
              Decoupled cloud media persistence storing raw video files with global HTTP byte-range streaming.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: 12, border: '1px solid #e1e8ed', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#1c1e21' }}>Role-Based Access (RBAC)</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#65676b', lineHeight: 1.5 }}>
              Strict identity partitioning separating Superadmin, Influencer Creators, and Consumer Followers.
            </p>
          </div>
        </div>

        {/* AUTHOR & REPOSITORY FOOTER BADGE */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 24px',
            border: '1px solid #e1e8ed',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1c1e21' }}>
              Project: Scalable Cloud-Native Video Sharing Platform (COM769 Coursework 2)
            </div>
            <div style={{ fontSize: 13, color: '#65676b', marginTop: 4 }}>
              Author: <strong>Subin Shrestha</strong> (<a href="mailto:rtr.shrestha.subin@gmail.com" style={{ color: '#1877f2' }}>rtr.shrestha.subin@gmail.com</a>)
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a
              href="https://github.com/SubinS26/TestWebApp"
              target="_blank"
              rel="noopener noreferrer"
              className="sec_btn"
              style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <i className="fab fa-github"></i> GitHub Repository
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

export default Welcome
