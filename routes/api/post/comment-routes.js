// POST COMMENTING IS HANDLED BY THIS FILE

const app = require('express').Router(),
  db = require('../../../config/db'),
  User = require('../../../config/User'),
  root = process.cwd(),
  upload = require('multer')({
    dest: `${root}/dist/temp/`,
  }),
  { ProcessImage, DeleteAllOfFolder } = require('handy-image-processor'),
  { unlinkSync, createReadStream, createWriteStream } = require('fs')

// COMMENT TEXT [REQ = POST, TEXT]
app.post('/comment-text', async (req, res) => {
  try {
    let { post_id, post: alt_post, text = '' } = req.body
    let { id } = req.session
    if (!id) {
      return res.json({ success: false, mssg: 'You must be logged in to comment!' })
    }

    const postId = Number(post_id || alt_post)
    let comment = {
      type: 'text',
      text: text || '',
      commentSrc: '',
      comment_by: id,
      post_id: postId,
      comment_time: String(new Date().getTime()),
    }
    
    let sentiment = { sentiment: 'neutral', score: 0 }
    try {
      let { analyzeSentiment } = require('../../../config/SentimentService')
      sentiment = await analyzeSentiment(text)
    } catch (sErr) {
      console.warn('[Sentiment] Skipped:', sErr.message)
    }

    let { insertId } = await db.query('INSERT INTO comments SET ?', comment)
    try {
      await User.mentionUsers(text, id, postId, 'comment')
    } catch (mErr) {}

    res.json({
      success: true,
      mssg: 'Commented!!',
      comment_id: insertId,
      sentiment,
    })
  } catch (error) {
    db.catchError(error, res)
  }
})

// COMMENT IMAGE [REQ = POST, COMMENTIMAGE(FILE)]
app.post('/comment-image', upload.single('commentImage'), async (req, res) => {
  try {
    let { id } = req.session
    if (!id) {
      return res.json({ success: false, mssg: 'You must be logged in to comment!' })
    }

    if (!req.file) {
      return res.json({ success: false, mssg: 'Please select an image to attach!' })
    }

    const fs = require('fs')
    const path = require('path')
    const commentsDir = path.join(root, 'dist/comments')
    const tempDir = path.join(root, 'dist/temp')
    if (!fs.existsSync(commentsDir)) fs.mkdirSync(commentsDir, { recursive: true })
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    let { post: alt_post, post_id } = req.body
    const postId = Number(post_id || alt_post)
    const filename = `instagram_comment_${new Date().getTime()}.jpg`
    const localDest = path.join(commentsDir, filename)

    try {
      let obj = {
        srcFile: req.file.path,
        destFile: localDest,
      }
      await ProcessImage(obj)
    } catch (procErr) {
      fs.copyFileSync(req.file.path, localDest)
    }

    // Azure Blob Storage Upload in background
    try {
      const { uploadToAzureBlob } = require('../../../config/AzureBlob')
      uploadToAzureBlob(localDest, filename, req.file.mimetype).catch(blobErr => {
        console.warn('[Azure Blob] Comment sync warning:', blobErr.message)
      })
    } catch (blobErr) {}

    // Clean up temporary file safely
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
    } catch (unlinkErr) {}

    let insert = {
      type: 'image',
      text: '',
      commentSrc: filename,
      comment_by: id,
      post_id: postId,
      comment_time: String(new Date().getTime()),
    }

    let { insertId } = await db.query('INSERT INTO comments SET ?', insert)

    res.json({
      success: true,
      mssg: 'Commented!!',
      comment_id: insertId,
      filename,
    })
  } catch (error) {
    db.catchError(error, res)
  }
})

// COMMENT STICKER [REQ = POST, STICKER]
app.post('/comment-sticker', async (req, res) => {
  try {
    let { id } = req.session
    if (!id) {
      return res.json({ success: false, mssg: 'You must be logged in to comment!' })
    }

    const fs = require('fs')
    const path = require('path')
    const commentsDir = path.join(root, 'dist/comments')
    if (!fs.existsSync(commentsDir)) fs.mkdirSync(commentsDir, { recursive: true })

    let { sticker, post: alt_post, post_id } = req.body
    const postId = Number(post_id || alt_post)
    const filename = `instagram_comment_${new Date().getTime()}.jpg`
    const localDest = path.join(commentsDir, filename)
    const stickerSrc = path.join(root, 'dist/images/stickers', sticker)

    if (fs.existsSync(stickerSrc)) {
      fs.copyFileSync(stickerSrc, localDest)
    }

    let comment = {
      type: 'sticker',
      text: '',
      commentSrc: filename,
      comment_by: id,
      post_id: postId,
      comment_time: String(new Date().getTime()),
    }

    let { insertId } = await db.query('INSERT INTO comments SET ?', comment)

    res.json({
      success: true,
      mssg: 'Commented!!',
      comment_id: insertId,
      filename,
    })
  } catch (error) {
    db.catchError(error, res)
  }
})

// DELETE COMMENT [REQ = COMMENT_ID, TYPE, COMMENTSRC]
app.post('/delete-comment', async (req, res) => {
  let { comment_id, type, commentSrc } = req.body
  await db.query('DELETE FROM comments WHERE comment_id=?', [comment_id])

  if (type == 'image' || type == 'sticker') {
    unlinkSync(`${root}/dist/comments/${commentSrc}`)
  }

  res.json('H')
})

// EDIT COMMENT [REQ = COMMENT_ID, COMMENT]
app.post('/edit-comment', async (req, res) => {
  let { comment_id, comment } = req.body
  await db.query('UPDATE comments SET text=? WHERE comment_id=?', [
    comment,
    comment_id,
  ])
  res.json('Hello, World!!')
})

module.exports = app
