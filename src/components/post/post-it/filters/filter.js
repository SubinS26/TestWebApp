import React from 'react'
import { c_first } from '../../../../utils/utils'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CPP } from '../../../../actions/post'
import d from '../../../../utils/API/DOM'
import classNames from 'classnames'

const Filter = ({ filter, previewImg, targetFile, dispatch }) => {
  let f = filter.replace('filter-', '')
  const isVideo =
    targetFile &&
    ((targetFile.type && targetFile.type.startsWith('video/')) ||
      /\.(mp4|webm|ogg|mov|mkv|avi|m4v)$/i.test(targetFile.name || ''))

  let select = () => {
    new d('.filter_div').removeClass('select_receiver_toggle')
    new d(`.fp_${filter}`).addClass('select_receiver_toggle')
    dispatch(CPP('filter', filter))
  }

  return (
    <div className={classNames('filter_div', `fp_${filter}`)} onClick={select}>
      {isVideo ? (
        <video className={filter} src={previewImg} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <img className={filter} src={previewImg} />
      )}
      <span>{c_first(f)}</span>
    </div>
  )
}

Filter.propTypes = {
  filter: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  previewImg: state.Post.postIt.previewImg,
  targetFile: state.Post.postIt.targetFile,
})

export default connect(mapStateToProps)(Filter)
export { Filter as PureFilter }
