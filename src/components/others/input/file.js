import React, { Component, Fragment } from 'react'
import { string, func, oneOfType } from 'prop-types'

export default class FileInput extends Component {
  uniqueId = 'file_input_' + Math.random().toString(36).substring(2, 9)

  render() {
    const { label, value, fileChange, labelClass, id, accept = 'image/*,video/*', ...props } = this.props
    const targetId = id || this.uniqueId

    return (
      <Fragment>
        <input
          type="file"
          id={targetId}
          accept={accept}
          onChange={fileChange}
          {...props}
        />
        <label htmlFor={targetId} className={labelClass}>
          {typeof label === 'function' ? label() : label}
        </label>
      </Fragment>
    )
  }
}

FileInput.defaultProps = {
  value: '',
  label: '',
  labelClass: '',
}

FileInput.propTypes = {
  value: string,
  fileChange: func.isRequired,
  label: oneOfType([string, func]).isRequired,
  labelClass: string,
  id: string,
  accept: string,
}
