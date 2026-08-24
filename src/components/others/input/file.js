import React, { Fragment } from 'react'
import { string, func, oneOfType } from 'prop-types'

const FileInput = ({ label, value, fileChange, labelClass, id = 'file_input', ...props }) => {
  return (
    <Fragment>
      <input
        type="file"
        id={id}
        accept="image/*,video/*"
        onChange={fileChange}
        {...props}
      />
      <label htmlFor={id} className={labelClass}>
        {typeof label == 'function' ? label() : label}
      </label>
    </Fragment>
  )
}

FileInput.defaultProps = {
  value: '',
  label: '',
  labelClass: '',
}

FileInput.propTypes = {
  value: string.isRequired,
  fileChange: func.isRequired,
  label: oneOfType([string, func]).isRequired,
  labelClass: string,
}

export default FileInput
