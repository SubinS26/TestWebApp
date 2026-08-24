import React, { Component } from 'react'
import { func, oneOf, number } from 'prop-types'
import { connect } from 'react-redux'
import { FadeIn } from 'animate-components'
import ToolTip from 'react-tooltip'
import Overlay from '../../others/overlay'
import { CPP, resetPostIt } from '../../../actions/post'
import { addPost } from '../../../utils/post-utils'
import AddTags from './add-tags'
import ToggleAddTags from './toggleAddTags'
import GetLocation from './getLocation'
import AddEmojis from '../../others/emojis/add-emojis'
import PrimaryButton from '../../others/button/primary-btn'
import SecondaryButton from '../../others/button/secondary-btn'
import FileInput from '../../others/input/file'

@connect(store => ({
  session: store.User.session,
  postIt: store.Post.postIt,
  group_name: store.Group.group_details.name,
}))
export default class VideoPostModal extends Component {
  dp = (...args) => this.props.dispatch(CPP(...args))

  toggleOverlay = () => this.dp('showOverlay', !this.props.postIt.showOverlay)

  backAndReset = async e => {
    if (e) e.preventDefault()
    await this.props.dispatch(resetPostIt())
    this.props.back()
  }

  changeVideo = e => {
    let file = e.target.files && e.target.files[0]
    if (!file) return

    const blobUrl = URL.createObjectURL(file)
    this.dp('targetFile', file)
    this.dp('previewImg', blobUrl)
    this.dp('fileChanged', true)
  }

  postVideo = async e => {
    e.preventDefault()
    this.toggleOverlay()

    let { dispatch, group_name, postIt } = this.props
    let { showOverlay, fileChanged, ...rest } = postIt

    await addPost({
      dispatch,
      ...rest,
      filter: 'filter-normal',
      group_name,
    })

    this.toggleOverlay()
    this.backAndReset()
  }

  render() {
    let { session, postIt } = this.props
    let { username, id } = session
    let { desc, previewImg, location, fetchingLocation } = postIt

    return (
      <div className="post_it_portal_container">
        <Overlay />

        <div
          className="video_post_modal popup-wrapper-class"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            width: '740px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e4e4e4',
            overflow: 'hidden',
          }}
        >
          <FadeIn duration="300ms">
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #ebeef2',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={`/users/${id}/avatar.jpg`}
                  alt={username}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #0095f6',
                  }}
                />
                <div>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>
                    @{username}
                  </span>
                  {location && (
                    <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '2px' }}>
                      📍 {location.length > 25 ? `${location.substring(0, 25)}...` : location}
                    </div>
                  )}
                  {fetchingLocation && (
                    <div style={{ fontSize: '12px', color: '#0095f6', marginTop: '2px' }}>
                      📍 Fetching location...
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#65676b',
                    background: '#f0f2f5',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  🎬 Video Reel
                </span>
              </div>
            </div>

            {/* Main Content (Split View: Player Left, Caption & Options Right) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                minHeight: '360px',
                maxHeight: '440px',
              }}
            >
              {/* Left Video Player Section */}
              <div
                style={{
                  flex: '1.3',
                  backgroundColor: '#0a0c10',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '8px',
                }}
              >
                <video
                  src={previewImg}
                  controls
                  autoPlay
                  playsInline
                  loop
                  style={{
                    width: '100%',
                    maxHeight: '420px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </div>

              {/* Right Metadata & Caption Section */}
              <div
                style={{
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  backgroundColor: '#fafbfc',
                  borderLeft: '1px solid #ebeef2',
                  overflowY: 'auto',
                }}
              >
                <textarea
                  placeholder={`Write a caption for your reel, @${username}...`}
                  value={desc}
                  onChange={e => this.dp('desc', e.target.value)}
                  className="t_p_ta"
                  style={{
                    width: '100%',
                    flex: '1',
                    minHeight: '120px',
                    border: '1px solid #e1e4e8',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#24292e',
                    resize: 'none',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />

                {/* Additional controls: Tagging & Location */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <AddEmojis
                    position={{ top: 104, left: -215 }}
                    textArea=".t_p_ta"
                    updateTextArea={value => this.dp('desc', value)}
                    addClassOnClicked
                    className="p_span_toggle"
                  />

                  <ToggleAddTags />
                  <GetLocation />
                </div>

                <AddTags />
              </div>
            </div>

            {/* Footer Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderTop: '1px solid #ebeef2',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <FileInput
                  id="change_video_input"
                  fileChange={this.changeVideo}
                  label="Change Video"
                  labelClass="sec_btn"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <SecondaryButton label="Cancel" onClick={this.backAndReset} />
                <PrimaryButton
                  label="Post Reel"
                  onClick={this.postVideo}
                  extraClass="p_post"
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {postIt.showOverlay && <Overlay type="white" />}
        <ToolTip />
      </div>
    )
  }
}

VideoPostModal.propTypes = {
  back: func.isRequired,
}
