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

  let isVideo =
    targetFile &&
    ((targetFile.type && targetFile.type.startsWith('video/')) ||
      /\.(mp4|webm|ogg|mov|mkv|avi|m4v)$/i.test(targetFile.name || ''))

  let fileChange = e => {
    e.preventDefault()
    let file = e.target.files[0]
    if (!file) return

    const isVideoFile =
      (file.type && file.type.startsWith('video/')) ||
      /\.(mp4|webm|ogg|mov|mkv|avi|m4v)$/i.test(file.name || '')

    if (isVideoFile) {
      const blobUrl = URL.createObjectURL(file)
      dp('fileChanged', true)
      dp('fileInput', e.target.value)
      dp('targetFile', file)
      dp('previewImg', blobUrl)
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
          <div className="i_p_img" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {isVideo ? (
              <video
                src={previewImg}
                controls
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  maxHeight: '260px',
                  objectFit: 'contain',
                  backgroundColor: '#000',
                  borderRadius: '4px',
                }}
              />
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
