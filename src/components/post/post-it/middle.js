import React from 'react'
import { connect } from 'react-redux'
import FileInput from '../../others/input/file'
import TextArea from '../../others/input/textArea'
import { CPP } from '../../../actions/post'
import Notify from 'handy-notification'

const PostItMiddle = ({ postIt, session, dispatch }) => {
  let { username } = session
  let { fileChanged, desc, previewImg, filter, fileInput, targetFile } = postIt

  let dp = (...args) => dispatch(CPP(...args))

  let isVideo = targetFile && targetFile.type && targetFile.type.startsWith('video/')

  let fileChange = e => {
    e.preventDefault()
    let file = e.target.files[0]
    if (!file) return

    if (file.type && file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src)
        if (video.duration > 300) {
          Notify({ value: 'Video duration must be 5 minutes or less!' })
          return
        }
        dp('fileChanged', true)
        dp('fileInput', e.target.value)
        dp('targetFile', file)
        let reader = new FileReader()
        reader.onload = ev => dp('previewImg', ev.target.result)
        reader.readAsDataURL(file)
      }
      video.src = URL.createObjectURL(file)
    } else {
      dp('fileChanged', true)
      dp('fileInput', e.target.value)
      dp('targetFile', file)
      let reader = new FileReader()
      reader.onload = ev => dp('previewImg', ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  let valueChange = e => dp('desc', e.target.value)

  return (
    <div className="i_p_main p_main" style={{ minHeight: 296, maxHeight: 380, overflowY: 'auto' }}>
      {// Show if image/file is selected
      fileChanged ? (
        <div>
          <div className="i_p_ta">
            <TextArea
              placeholder={`What's new with you, @${username}?`}
              value={desc}
              valueChange={valueChange}
              className="t_p_ta"
            />
          </div>
          <div className="i_p_img">
            {isVideo ? (
              <video src={previewImg} className={filter} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src={previewImg} className={filter} />
            )}
          </div>
        </div>
      ) : (
        // If not show button to select
        <form
          className="post_img_form"
          method="post"
          encType="multipart/formdata"
        >
          <FileInput
            value={fileInput}
            fileChange={fileChange}
            label="Choose photo or video"
            labelClass="pri_btn"
          />
        </form>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  session: state.User.session,
  postIt: state.Post.postIt,
})

export default connect(mapStateToProps)(PostItMiddle)
export { PostItMiddle as PurePostItMiddle }
