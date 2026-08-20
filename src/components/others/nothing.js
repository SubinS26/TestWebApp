import React from 'react'
import PropTypes from 'prop-types'

const Nothing = props => {
  let { mssg, showMssg, secondMssg, conPage, showImg } = props

  return (
    <div className="home_last_mssg" style={{ border: !showMssg ? 'none' : '' }}>
      {showImg ? (
        <img src={`/images/${conPage ? 'elephant-march.png' : 'large.jpg'}`} />
      ) : null}
      {showMssg ? <span className="nothingMssg">{mssg}</span> : null}
      <span className="secondMssg">{secondMssg}</span>
    </div>
  )
}

Nothing.defaultProps = {
  mssg: 'Hello, a message for you!!',
  showMssg: true,
  secondMssg: '',
  conPage: false,
  showImg: true,
}

Nothing.propTypes = {
  mssg: PropTypes.string,
  showMssg: PropTypes.bool,
  secondMssg: PropTypes.string,
  conPage: PropTypes.bool,
}

export default Nothing
