import React, { Fragment } from 'react'
import { FadeIn } from 'animate-components'
import ToolTip from 'react-tooltip'
import PropTypes from 'prop-types'
import Overlay from '../overlay'
import ImageTheatreInfo from './info'

const ImageTheatre = props => {
  let { imgSrc, filter, back } = props

  return (
    <Fragment>
      <Overlay close_on_click close={back} opacity={0.9} />

      <div className="image_show">
        <FadeIn duration="300ms">
          <div className="img_s_img">
            {/\.(mp4|webm|ogg|mov|mkv)$/i.test(imgSrc) || (imgSrc.startsWith('http') && /\.(mp4|webm|ogg|mov|mkv)/i.test(imgSrc)) ? (
              <video src={imgSrc} className={filter} controls playsInline style={{ maxWidth: '100%', maxHeight: '80vh' }} />
            ) : (
              <img src={imgSrc} className={filter} />
            )}

            <ImageTheatreInfo {...props} />
          </div>

          <ToolTip />
        </FadeIn>
      </div>
    </Fragment>
  )
}

ImageTheatre.defaultProps = {
  showInfo: true,
  imgSrc: '/images/location.jpg',
  filter: '',
}

ImageTheatre.propTypes = {
  showInfo: PropTypes.bool,
  imgSrc: PropTypes.string.isRequired,
  filter: PropTypes.string,
  username: PropTypes.string,
  link: PropTypes.string,
  time: PropTypes.string,
  back: PropTypes.func.isRequired,
}

export default ImageTheatre
