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

    return (
      <div>
        <div className="p_o">
          <div className="p_actual" spellCheck="false">
            <div
              className="p_abt"
              style={{ marginBottom: description ? '10px' : null }}
            >
              <p>
                <ToTags str={`${description}`} />
              </p>
            </div>

            {/\.(mp4|webm|ogg|mov|mkv)$/i.test(imgSrc) || (imgSrc.startsWith('http') && /\.(mp4|webm|ogg|mov|mkv)/i.test(imgSrc)) ? (
              <video
                src={imgSrc.startsWith('http') ? imgSrc : `/posts/${imgSrc}`}
                className={classNames('p_img', filter)}
                controls
                playsInline
                style={{ width: '100%', maxHeight: '500px', backgroundColor: 'black' }}
              />
            ) : (
              <img
                src={imgSrc.startsWith('http') ? imgSrc : `/posts/${imgSrc}`}
                className={classNames('p_img', filter)}
                onClick={() => this._toggle('showImage')}
              />
            )}

            <PostTags post_id={post_id} tags_count={tags_count} />
          </div>
        </div>

        {showImage && (
          <ImageTheatre
            imgSrc={imgSrc.startsWith('http') ? imgSrc : `/posts/${imgSrc}`}
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
    tags_count: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
}
