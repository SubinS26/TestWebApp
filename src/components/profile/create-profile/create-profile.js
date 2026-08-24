/**
 * @author Subin Shrestha <rtr.shrestha.subin@gmail.com>
 * GitHub repo: https://github.com/SubinS26/TestWebApp
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FadeIn } from 'animate-components'
import { post } from 'axios'
import Notify from 'handy-notification'
import Title from '../../others/title'
import PrimaryButton from '../../others/button/primary-btn'
import SecondaryButton from '../../others/button/secondary-btn'
import { getUserDetails } from '../../../actions/user'
import { uData, imageCompressor } from '../../../utils/utils'

const PRESET_INTERESTS = [
  '#Tech',
  '#Reels',
  '#Cloud',
  '#AI',
  '#Coding',
  '#Design',
  '#Photography',
  '#Music',
  '#Travel',
  '#Gaming',
  '#Education',
  '#Fitness',
]

class CreateProfileWizard extends Component {
  state = {
    step: 1,
    firstname: '',
    surname: '',
    bio: '',
    phone: '',
    instagram: '',
    twitter: '',
    github: '',
    website: '',
    account_type: 'public',
    selectedInterests: ['#Tech', '#Reels'],
    customTag: '',
    avatarPreview: null,
    avatarFile: null,
    saving: false,
  }

  componentDidMount = () => {
    let username = uData('username')
    if (username) {
      this.props.dispatch(getUserDetails(username))
    }
  }

  componentWillReceiveProps = ({ ud }) => {
    if (ud && ud.id) {
      this.setState({
        firstname: ud.firstname || '',
        surname: ud.surname || '',
        bio: ud.bio || '',
        phone: ud.phone || '',
        instagram: ud.instagram || '',
        twitter: ud.twitter || '',
        github: ud.github || '',
        website: ud.website || '',
        account_type: ud.account_type || 'public',
      })
    }
  }

  handleChange = (field, e) => {
    this.setState({ [field]: e.target.value })
  }

  toggleInterest = tag => {
    let { selectedInterests } = this.state
    if (selectedInterests.includes(tag)) {
      this.setState({ selectedInterests: selectedInterests.filter(t => t !== tag) })
    } else {
      this.setState({ selectedInterests: [...selectedInterests, tag] })
    }
  }

  addCustomTag = e => {
    e.preventDefault()
    let { customTag, selectedInterests } = this.state
    let tag = customTag.trim()
    if (!tag) return
    if (!tag.startsWith('#')) tag = `#${tag}`
    if (!selectedInterests.includes(tag)) {
      this.setState({
        selectedInterests: [...selectedInterests, tag],
        customTag: '',
      })
    }
  }

  handleAvatarChange = async e => {
    let file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      Notify({ value: 'Please select an image file!' })
      return
    }

    try {
      let compressed = await imageCompressor(file)
      let reader = new FileReader()
      reader.onload = ev => {
        this.setState({
          avatarPreview: ev.target.result,
          avatarFile: compressed,
        })
      }
      reader.readAsDataURL(compressed)
    } catch (err) {
      Notify({ value: 'Error processing avatar' })
    }
  }

  nextStep = () => {
    let { step, firstname, surname } = this.state
    if (step === 1 && (!firstname.trim() || !surname.trim())) {
      Notify({ value: 'Please enter your first name and last name' })
      return
    }
    this.setState({ step: Math.min(step + 1, 4) })
  }

  prevStep = () => {
    this.setState({ step: Math.max(this.state.step - 1, 1) })
  }

  saveProfile = async () => {
    this.setState({ saving: true })
    let {
      firstname,
      surname,
      bio,
      phone,
      instagram,
      twitter,
      github,
      website,
      account_type,
      selectedInterests,
      avatarFile,
    } = this.state

    let username = uData('username')

    try {
      // 1. Update basic profile info
      let { data: editRes } = await post('/api/edit-profile', {
        username,
        firstname,
        surname,
        bio,
        phone,
        instagram,
        twitter,
        github,
        website,
        account_type,
        resend_vl: false,
      })

      if (editRes && editRes.success === false && editRes.mssg) {
        Notify({ value: editRes.mssg })
        this.setState({ saving: false })
        return
      }

      // 2. Upload avatar if changed
      if (avatarFile) {
        let form = new FormData()
        form.append('avatar', avatarFile)
        form.append('of', 'user')
        form.append('group', 0)
        await post('/api/upload-avatar', form)
      }

      // 3. Add interests as tags
      for (let tag of selectedInterests) {
        let cleanedTag = tag.replace('#', '')
        if (cleanedTag) {
          try {
            await post('/api/add-tag', { tag: cleanedTag })
          } catch (e) {
            // Ignore duplicate tag insertion errors
          }
        }
      }

      Notify({
        value: '🎉 Profile created successfully! Welcome to VideoShare.',
        done: () => {
          location.href = `/profile/${username}`
        },
      })
    } catch (error) {
      Notify({ value: 'Error saving profile, please try again' })
      this.setState({ saving: false })
    }
  }

  render() {
    let {
      step,
      firstname,
      surname,
      bio,
      phone,
      instagram,
      twitter,
      github,
      website,
      selectedInterests,
      customTag,
      avatarPreview,
      saving,
    } = this.state

    let username = uData('username')
    let userId = uData('session')
    let currentAvatar = avatarPreview || `/users/${userId}/avatar.jpg`

    return (
      <div className="profile_wizard_container" style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
        <Title value="Set Up Your Profile • VideoShare" />

        <FadeIn duration="300ms">
          <div
            className="wizard_card"
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e1e8ed',
              overflow: 'hidden',
            }}
          >
            {/* Wizard Header & Progress Bar */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1877f2 0%, #00c6ff 100%)',
                color: '#fff',
                padding: '24px 30px',
                textAlign: 'center',
              }}
            >
              <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700 }}>
                Welcome to VideoShare, @{username}!
              </h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>
                Let's set up your profile in just a few quick steps.
              </p>

              {/* Progress Steps Indicators */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  gap: 12,
                }}
              >
                {[
                  { num: 1, label: 'Identity' },
                  { num: 2, label: 'Avatar' },
                  { num: 3, label: 'Interests' },
                  { num: 4, label: 'Social & Launch' },
                ].map(s => (
                  <div
                    key={s.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      opacity: step >= s.num ? 1 : 0.6,
                      fontWeight: step === s.num ? '700' : '400',
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: step >= s.num ? '#fff' : 'rgba(255,255,255,0.3)',
                        color: step >= s.num ? '#1877f2' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {s.num}
                    </span>
                    <span>{s.label}</span>
                    {s.num < 4 && <span style={{ marginLeft: 6, opacity: 0.5 }}>&rarr;</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div style={{ padding: '30px' }}>
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: 16, color: '#1c1e21', fontSize: 18 }}>
                    <i className="fas fa-user" style={{ marginRight: 8, color: '#1877f2' }}></i>
                    Step 1: Personal Identity & Bio
                  </h3>
                  <p style={{ color: '#65676b', fontSize: 14, marginBottom: 20 }}>
                    Tell the community who you are. These details appear on your public profile.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={firstname}
                        onChange={e => this.handleChange('firstname', e)}
                        placeholder="e.g. John"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={surname}
                        onChange={e => this.handleChange('surname', e)}
                        placeholder="e.g. Doe"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                      Bio / About You
                    </label>
                    <textarea
                      value={bio}
                      onChange={e => this.handleChange('bio', e)}
                      placeholder="Share a short intro about your reels, interests, or passions..."
                      rows={4}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => this.handleChange('phone', e)}
                      placeholder="+44 7123 456789"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Profile Picture */}
              {step === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ marginTop: 0, marginBottom: 16, color: '#1c1e21', fontSize: 18 }}>
                    <i className="fas fa-camera" style={{ marginRight: 8, color: '#1877f2' }}></i>
                    Step 2: Choose Your Profile Picture
                  </h3>
                  <p style={{ color: '#65676b', fontSize: 14, marginBottom: 25 }}>
                    Upload a high-quality picture to stand out on the video feed.
                  </p>

                  <div style={{ marginBottom: 25 }}>
                    <img
                      src={currentAvatar}
                      alt="Avatar Preview"
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #1877f2',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                      onError={e => {
                        e.target.src = '/images/spacecraft.jpg'
                      }}
                    />
                  </div>

                  <label
                    className="pri_btn"
                    style={{
                      display: 'inline-block',
                      padding: '10px 24px',
                      cursor: 'pointer',
                      borderRadius: 6,
                      fontWeight: 600,
                    }}
                  >
                    <i className="fas fa-upload" style={{ marginRight: 8 }}></i>
                    Upload New Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={this.handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}

              {/* STEP 3: Interests & Tags */}
              {step === 3 && (
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: 16, color: '#1c1e21', fontSize: 18 }}>
                    <i className="fas fa-hashtag" style={{ marginRight: 8, color: '#1877f2' }}></i>
                    Step 3: Select Your Video & Content Interests
                  </h3>
                  <p style={{ color: '#65676b', fontSize: 14, marginBottom: 20 }}>
                    Pick topics you enjoy watching or creating so we can customize your feed.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 25 }}>
                    {PRESET_INTERESTS.map(tag => {
                      let selected = selectedInterests.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => this.toggleInterest(tag)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 20,
                            border: selected ? '2px solid #1877f2' : '1px solid #ccd0d5',
                            background: selected ? '#e7f3ff' : '#f0f2f5',
                            color: selected ? '#1877f2' : '#4b4f56',
                            fontWeight: selected ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {tag} {selected && '✓'}
                        </button>
                      )
                    })}
                  </div>

                  <form onSubmit={this.addCustomTag} style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      value={customTag}
                      onChange={e => this.setState({ customTag: e.target.value })}
                      placeholder="Add custom hashtag (e.g. #gaming)"
                      style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                    />
                    <button
                      type="submit"
                      className="sec_btn"
                      style={{ padding: '10px 18px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      + Add Tag
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 4: Social Connect & Launch */}
              {step === 4 && (
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: 16, color: '#1c1e21', fontSize: 18 }}>
                    <i className="fas fa-globe" style={{ marginRight: 8, color: '#1877f2' }}></i>
                    Step 4: Social Links & Account Preferences
                  </h3>
                  <p style={{ color: '#65676b', fontSize: 14, marginBottom: 20 }}>
                    Add your external links and preview your profile.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                        <i className="fab fa-instagram" style={{ color: '#e1306c', marginRight: 6 }}></i> Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={instagram}
                        onChange={e => this.handleChange('instagram', e)}
                        placeholder="username"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                        <i className="fab fa-twitter" style={{ color: '#1da1f2', marginRight: 6 }}></i> Twitter / X Handle
                      </label>
                      <input
                        type="text"
                        value={twitter}
                        onChange={e => this.handleChange('twitter', e)}
                        placeholder="username"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                        <i className="fab fa-github" style={{ color: '#333', marginRight: 6 }}></i> GitHub Profile
                      </label>
                      <input
                        type="text"
                        value={github}
                        onChange={e => this.handleChange('github', e)}
                        placeholder="username"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b4f56', marginBottom: 6 }}>
                        <i className="fas fa-link" style={{ color: '#00c6ff', marginRight: 6 }}></i> Portfolio / Website
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={e => this.handleChange('website', e)}
                        placeholder="https://mysite.com"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 14 }}
                      />
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div
                    style={{
                      background: '#f7f8fa',
                      border: '1px solid #e1e8ed',
                      borderRadius: 8,
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <img
                      src={currentAvatar}
                      alt="Avatar"
                      style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                      onError={e => {
                        e.target.src = '/images/spacecraft.jpg'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1c1e21' }}>
                        {firstname} {surname} (@{username})
                      </div>
                      <div style={{ fontSize: 13, color: '#65676b', marginTop: 2 }}>
                        {bio || 'Ready to explore videos on VideoShare'}
                      </div>
                      <div style={{ fontSize: 12, color: '#1877f2', marginTop: 4 }}>
                        {selectedInterests.slice(0, 5).join(' ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 30,
                  paddingTop: 20,
                  borderTop: '1px solid #e4e6eb',
                }}
              >
                {step > 1 ? (
                  <SecondaryButton label="&larr; Back" onClick={this.prevStep} />
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <PrimaryButton label="Continue &rarr;" onClick={this.nextStep} />
                ) : (
                  <PrimaryButton
                    label={saving ? 'Saving Profile...' : '🚀 Complete Setup & Launch'}
                    onClick={this.saveProfile}
                    disabled={saving}
                  />
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ud: state.User.user_details,
})

export default connect(mapStateToProps)(CreateProfileWizard)
