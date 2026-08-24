import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { FadeIn } from 'animate-components'
import Overlay from '../../others/overlay'
import ToolTip from 'react-tooltip'
import Filters from './filters/filters'
import GetLocation from './getLocation'
import PostItHeader from './header'
import AddTags from './add-tags'
import Middle from './middle'
import ToggleAddTags from './toggleAddTags'
import PostItActions from './actions'
import { func, oneOf, number } from 'prop-types'
import AddEmojis from '../../others/emojis/add-emojis'
import { CPP } from '../../../actions/post'
import { connect } from 'react-redux'

import VideoPostModal from './video-post-modal'

@connect(store => ({
  postIt: store.Post.postIt,
}))
export default class PostIt extends Component {
  componentDidMount = () => {
    let { type, group, dispatch } = this.props
    dispatch(CPP('type', type))
    dispatch(CPP('group', group))
  }

  render() {
    let {
      postIt: { fileChanged, showOverlay, targetFile },
      dispatch,
      back,
    } = this.props

    const isVideo =
      targetFile &&
      ((targetFile.type && targetFile.type.startsWith('video/')) ||
        /\.(mp4|webm|ogg|mov|mkv|avi|m4v|flv|wmv|3gp|ogv)$/i.test(targetFile.name || ''))

    const isTest = process.env.NODE_ENV === 'test'

    const modalContent = (
      <div className="post_it_portal_container">
        <Overlay />

        <div
          className="post popup-wrapper-class"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <FadeIn duration="300ms">
            {fileChanged && !isVideo && <Filters />}

            <PostItHeader />
            <Middle />
            <AddTags />

            <div className="t_p_bottom p_bottom">
              <div
                className="t_p_tag p_tag"
                style={{ visibility: !fileChanged && 'hidden' }}
              >
                <AddEmojis
                  position={{ top: 104, left: -215 }}
                  textArea=".t_p_ta"
                  updateTextArea={value => dispatch(CPP('desc', value))}
                  addClassOnClicked
                  className="p_span_toggle"
                />

                <ToggleAddTags />
                <GetLocation />
              </div>

              <PostItActions back={back} />
            </div>
          </FadeIn>
        </div>

        {showOverlay && <Overlay type="white" />}

        <ToolTip />
      </div>
    )

    return !isTest && typeof document !== 'undefined' && document.body
      ? createPortal(modalContent, document.body)
      : modalContent
  }
}

PostIt.propTypes = {
  back: func.isRequired,
  type: oneOf(['user', 'group']).isRequired,
  group: number,
}
