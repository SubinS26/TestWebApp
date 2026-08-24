import React, { Component } from 'react'
import ToTags from '../../../hashtag/toTags/toTags'
import ImageTheatre from '../../../others/imageTheatre/imageTheatre'
import PropTypes from 'prop-types'
import PostTags from './post-tags'
import classNames from 'classnames'

export default class PostImage extends Component {
  state = {
    showImage: false,
  }

  _toggle = what => this.setState({ [what]: !this.state[what] })

  render() {
    let {
      postDetails: {
        post_id,
        post_time,
        description,
        imgSrc,
        filter,
        username,
        tags_count,
      },
    } = this.props
    let { showImage } = this.state

    const isVideo =
      imgSrc &&
      (/\.(mp4|webm|ogg|mov|mkv|avi|m4v|flv|wmv|3gp|ogv)$/i.test(imgSrc) ||
        (typeof imgSrc === 'string' &&
          imgSrc.startsWith('http') &&
          /\.(mp4|webm|ogg|mov|mkv|avi|m4v|flv|wmv|3gp|ogv)/i.test(imgSrc)))

    const mediaSrc = imgSrc
      ? imgSrc.startsWith('http')
        ? imgSrc
        : `/posts/${imgSrc}`
      : ''

    return (
      <div>
        <div className="p_o">
          <div className="p_actual" spellCheck="false">
            <div
              className="p_abt"
              style={{ marginBottom: description ? '10px' : null }}
            >
              <p>
                <ToTags str={`${description || ''}`} />
              </p>
            </div>

            {isVideo ? (
              <video
                src={mediaSrc}
                className={classNames('p_img', filter)}
                controls
                playsInline
                preload="metadata"
                style={{ width: '100%', maxHeight: '500px', backgroundColor: 'black' }}
              />
            ) : mediaSrc ? (
              <img
                src={mediaSrc}
                className={classNames('p_img', filter)}
                loading="lazy"
                onClick={() => this._toggle('showImage')}
              />
            ) : null}

            <PostTags post_id={post_id} tags_count={tags_count} />
          </div>
        </div>

        {showImage && mediaSrc && (
          <ImageTheatre
            imgSrc={mediaSrc}
            filter={filter}
            username={username}
            time={post_time}
            link={`/post/${post_id}`}
            back={() => this._toggle('showImage')}
          />
        )}
      </div>
    )
  }
}

PostImage.propTypes = {
  postDetails: PropTypes.shape({
    post_id: PropTypes.number.isRequired,
    post_time: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    tags_count: PropTypes.number.isRequired,
  }).isRequired,
}
