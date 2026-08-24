// ALL POST-RELATED ROUTES ARE HANDLED BY THIS FILE

const app = require('express').Router(),
  db = require('../../../config/db'),
  Post = require('../../../config/Post'),
  User = require('../../../config/User'),
  root = process.cwd(),
  upload = require('multer')({
    dest: `${root}/dist/temp/`,
  }),
  { ProcessImage, DeleteAllOfFolder } = require('handy-image-processor')

// POST [REQ = DESC, FILTER, LOCATION, TYPE, GROUP, IMAGE(FILE) ]
app.post('/post-it', upload.single('image'), async (req, res) => {
  try {
    let { id } = req.session
    if (!id) {
      return res.json({ success: false, mssg: 'You must be logged in to post!' })
    }

    if (!req.file) {
      return res.json({ success: false, mssg: 'Please attach an image or video file!' })
    }

    let { desc = '', filter = 'filter-normal', location = '', type = 'user', group = 0 } = req.body
    const fs = require('fs')
    const path = require('path')

    // Ensure posts and temp directories exist
    const postsDir = path.join(root, 'dist/posts')
    const tempDir = path.join(root, 'dist/temp')
    if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true })
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const isVideo = req.file.mimetype && (req.file.mimetype.startsWith('video/') || /\.(mp4|webm|ogg|mov|mkv|flv|wmv|m4v|3gp|ogv|avi)$/i.test(req.file.originalname))
    const extension = isVideo
      ? (req.file.originalname.split('.').pop() || 'mp4').toLowerCase()
      : 'jpg'
    const filename = `instagram_${new Date().getTime()}.${extension}`
    const localDest = path.join(postsDir, filename)
    let finalSrc = filename

    if (isVideo) {
      fs.copyFileSync(req.file.path, localDest)
    } else {
      try {
        let obj = {
          srcFile: req.file.path,
          destFile: localDest,
        }
        await ProcessImage(obj)
      } catch (procErr) {
        fs.copyFileSync(req.file.path, localDest)
      }
    }

    // Azure Blob Storage Upload in background for high speed
    try {
      const { uploadToAzureBlob } = require('../../../config/AzureBlob')
      uploadToAzureBlob(localDest, filename, req.file.mimetype).catch(blobErr => {
        console.warn('[Azure Blob] Background sync warning:', blobErr.message)
      })
    } catch (blobErr) {}

    // Safely remove temporary file
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
    } catch (unlinkErr) {}

    let insert = {
      user: id,
      description: desc || '',
      imgSrc: finalSrc,
      filter: filter || 'filter-normal',
      location: location || '',
      type: type || 'user',
      group_id: Number(group) || 0,
      post_time: String(new Date().getTime()),
    }

    let { insertId } = await db.query('INSERT INTO posts SET ?', insert)
    let firstname = await User.getWhat('firstname', id)
    let surname = await User.getWhat('surname', id)

    try {
      const cache = require('../../../config/cache')
      cache.del('explore:photos:latest')
    } catch (cErr) {}

    try {
      await db.toHashtag(desc, id, insertId)
      await User.mentionUsers(desc, id, insertId, 'post')
    } catch (tagErr) {}

    res.json({
      success: true,
      mssg: 'Posted!!',
      post_id: insertId,
      firstname: firstname || '',
      surname: surname || '',
      filename: finalSrc,
    })
  } catch (error) {
    db.catchError(error, res)
  }
})

// TAGS USERS FOR A POST [REQ = TAGS, POST_ID]
app.post('/tag-post', (req, res) => {
  let { tags, post_id } = req.body
  tags.forEach(async t => {
    let tagInsert = {
      post_id: post_id,
      user: t.user,
    }
    await db.query('INSERT INTO post_tags SET ?', tagInsert)
  })
  res.json(null)
})

// EDIT POST [REQ = POST, DESCRIPTION]
app.post('/edit-post', async (req, res) => {
  try {
    let { post_id, description } = req.body
    let { id } = req.session

    await db.query('UPDATE posts SET description=? WHERE post_id=?', [
      description,
      post_id,
    ])
    await db.query('DELETE FROM hashtags WHERE post_id=?', [post_id])
    await db.toHashtag(description, id, post_id)

    res.json({
      success: true,
      mssg: 'Post updated!!',
    })
  } catch (error) {
    db.catchError(error, res)
  }
})

// GET POST TAGS [REQ = POST]
app.post('/get-post-tags', async (req, res) => {
  let { post } = req.body,
    { id } = req.session,
    tags = await db.query(
      'SELECT post_tags.post_tag_id, post_tags.post_id, post_tags.user, users.username, users.firstname, users.surname FROM post_tags, users WHERE post_tags.post_id = ? AND post_tags.user = users.id ORDER BY post_tag_id DESC',
      [post]
    ),
    array = []

  for (let t of tags) {
    array.push({
      ...t,
      isFollowing: await User.isFollowing(id, t.user),
    })
  }

  res.json({
    tags: array,
    isPostMine: await Post.isPostMine(id, post),
  })
})

// UNTAG [REQ = POST, USER]
app.post('/untag', async (req, res) => {
  let { user, post } = req.body
  await db.query('DELETE FROM post_tags WHERE post_id=? AND user=?', [
    post,
    user,
  ])
  res.json('Hello, World!!')
})

// DELETE POST [REQ = POST]
app.post('/delete-post', async (req, res) => {
  try {
    await Post.deletePost({
      post: req.body.post,
      when: 'user',
    })
    res.json({
      success: true,
      mssg: 'Post deleted!!',
    })
  } catch (error) {
    db.catchError(error, res)
  }
})

module.exports = app
