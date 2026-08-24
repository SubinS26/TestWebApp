import React from 'react'
import PropTypes from 'prop-types'

const MediaThumbnail = ({ photo, margin, index, onClick }) => {
  const isVideo =
    photo.src &&
    /\.(mp4|webm|ogg|mov|mkv|avi|m4v|flv|wmv|3gp|ogv)$/i.test(photo.src)

  const containerStyle = {
    display: 'block',
    float: 'left',
    margin: margin,
    width: photo.width,
    height: photo.height,
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px',
    backgroundColor: '#0a0a0a',
  }

  const handleClick = e => {
    if (onClick) {
      onClick(e, { photo, index })
    }
  }

  return (
    <div
      style={containerStyle}
      onClick={handleClick}
      className={photo.className || ''}
      title={isVideo ? 'Watch Reel' : 'View Photo'}
    >
      {isVideo ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <video
            src={photo.src}
            muted
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Reel indicator badge */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '3px 6px',
              fontSize: '11px',
              fontWeight: '600',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            ▶ Reel
          </div>
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}
    </div>
  )
}

MediaThumbnail.propTypes = {
  photo: PropTypes.object.isRequired,
  margin: PropTypes.number,
  index: PropTypes.number,
  onClick: PropTypes.func,
}

export default MediaThumbnail
