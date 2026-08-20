import React from 'react'
import Nothing from '../nothing'
import PropTypes from 'prop-types'
import { cLoading } from '../../../utils/utils'
import classNames from 'classnames'

const ModalMiddle = ({ loading, list, mssg, showMssg, showImg }) => {
  let len = list.length

  return (
    <div className={classNames('modal_main', cLoading(loading))}>
      {len == 0 ? (
        <Nothing
          mssg={mssg || 'No posts yet'}
          showMssg={showMssg !== undefined ? showMssg : !!mssg}
          showImg={showImg !== undefined ? showImg : true}
        />
      ) : (
        list
      )}
    </div>
  )
}

ModalMiddle.propTypes = {
  loading: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.node).isRequired,
  mssg: PropTypes.string,
  showMssg: PropTypes.bool,
  showImg: PropTypes.bool,
}

export default ModalMiddle
