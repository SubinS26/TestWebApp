const app = require('express').Router(),
  db = require('../../../config/db'),
  Group = require('../../../config/Group'),
  Post = require('../../../config/Post'),
  User = require('../../../config/User')

/**
 * Ultra-fast batch count resolution for posts
 * Eliminates 200+ N+1 SQL queries into 4 parallel batch lookups
 */
const batchAttachCounts = async postsList => {
  if (!postsList || postsList.length === 0) return []
  const postIds = postsList.map(p => p.post_id)

  const [likesRows, commentsRows, tagsRows, sharesRows] = await Promise.all([
    db.query(
      'SELECT post_id, COUNT(*) AS count FROM likes WHERE post_id IN (?) GROUP BY post_id',
      [postIds]
    ),
    db.query(
      'SELECT post_id, COUNT(*) AS count FROM comments WHERE post_id IN (?) GROUP BY post_id',
      [postIds]
    ),
    db.query(
      'SELECT post_id, COUNT(*) AS count FROM post_tags WHERE post_id IN (?) GROUP BY post_id',
      [postIds]
    ),
    db.query(
      'SELECT post_id, COUNT(*) AS count FROM shares WHERE post_id IN (?) GROUP BY post_id',
      [postIds]
    ),
  ])

  const likesMap = new Map(likesRows.map(r => [r.post_id, r.count]))
  const commentsMap = new Map(commentsRows.map(r => [r.post_id, r.count]))
  const tagsMap = new Map(tagsRows.map(r => [r.post_id, r.count]))
  const sharesMap = new Map(sharesRows.map(r => [r.post_id, r.count]))

  return postsList.map(p => ({
    ...p,
    likes_count: likesMap.get(p.post_id) || 0,
    comments_count: commentsMap.get(p.post_id) || 0,
    tags_count: tagsMap.get(p.post_id) || 0,
    shares_count: sharesMap.get(p.post_id) || 0,
    group_name: '',
  }))
}

// GET USER POSTS [REQ = USERNAME]
app.post('/get-user-posts', async (req, res) => {
  let id = await User.getId(req.body.username),
    _posts = await db.query(
      'SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.post_time FROM posts, users WHERE posts.user=? AND posts.user = users.id AND posts.type=? ORDER BY posts.post_time DESC LIMIT 40',
      [id, 'user']
    )

  let posts = await batchAttachCounts(_posts)
  res.json(posts)
})

// GET BOOKMARKED POSTS [REQ = USER]
app.post('/get-bookmarked-posts', async (req, res) => {
  let _posts = await db.query(
    'SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.group_id, posts.post_time FROM posts, users, bookmarks WHERE bookmarks.bkmrk_by=? AND posts.user = users.id AND bookmarks.post_id = posts.post_id ORDER BY bookmarks.bkmrk_time DESC LIMIT 40',
    [req.body.user]
  )

  let posts = await batchAttachCounts(_posts)
  res.json(posts)
})

// GET TAGGED POSTS [REQ = USER]
app.post('/get-tagged-posts', async (req, res) => {
  let _posts = await db.query(
    'SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.group_id, posts.post_time FROM post_tags, posts, users WHERE post_tags.user = ? AND post_tags.post_id = posts.post_id AND posts.user = users.id ORDER BY posts.post_time DESC LIMIT 40',
    [req.body.user]
  )

  let posts = await batchAttachCounts(_posts)
  res.json(posts)
})

// GET SHARED POSTS [REQ = USER]
app.post('/get-shared-posts', async (req, res) => {
  let _posts = await db.query(
    'SELECT posts.post_id, shares.share_id, posts.user, users.username, users.firstname, users.surname, shares.share_by, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.group_id, posts.post_time, shares.share_time FROM shares, posts, users WHERE shares.share_to = ? AND shares.post_id = posts.post_id AND posts.user = users.id ORDER BY shares.share_time DESC LIMIT 40',
    [req.body.user]
  )

  let posts = await batchAttachCounts(_posts)
  res.json(posts)
})

// GET PHOTOS [REQ = USER]
app.post('/get-photos', async (req, res) => {
  let _photos = await db.query(
    'SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.imgSrc AS imgsrc, posts.filter, posts.post_time FROM posts, users WHERE posts.user = ? AND posts.user = users.id AND posts.type = ? ORDER BY posts.post_time DESC LIMIT 40',
    [req.body.user, 'user']
  )

  res.json(_photos)
})

// GET FEED
app.post('/get-feed', async (req, res) => {
  const userId = req.session && req.session.id ? Number(req.session.id) : 0

  // 1. Query personal feed (user's own posts + posts from creators they follow)
  let _posts = await db.query(
    `SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.group_id, posts.post_time 
     FROM posts 
     JOIN users ON posts.user = users.id 
     WHERE (posts.user = ? OR posts.user IN (SELECT follow_to FROM follow_system WHERE follow_by = ?)) AND posts.type = 'user' 
     ORDER BY posts.post_id DESC LIMIT 40`,
    [userId, userId]
  )

  // 2. Fallback: if user follows nobody or has no posts yet, show the latest platform video reels and posts so the feed is never blank
  if (!_posts || _posts.length === 0) {
    _posts = await db.query(
      `SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.group_id, posts.post_time 
       FROM posts 
       JOIN users ON posts.user = users.id 
       WHERE posts.type = 'user' AND posts.imgSrc <> ''
       ORDER BY posts.post_id DESC LIMIT 40`
    )
  }

  let posts = await batchAttachCounts(_posts)
  res.json(posts)
})

// GET POST BY [REQ = POST_ID]
app.post('/get-post', async (req, res) => {
  let { post_id } = req.body,
    _post = await db.query(
      'SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.description, posts.imgSrc, posts.filter, posts.location, posts.type, posts.group_id, posts.post_time FROM posts, users WHERE posts.post_id = ? AND posts.user = users.id',
      [post_id]
    ),
    {
      tags_count,
      likes_count,
      shares_count,
      comments_count,
    } = await Post.getCounts(post_id),
    comments = await db.query(
      'SELECT comments.comment_id, comments.type, comments.text, comments.commentSrc, comments.comment_by, users.username AS comment_by_username, comments.post_id, comments.comment_time FROM comments, users WHERE comments.post_id = ? AND comments.comment_by = users.id ORDER BY comments.comment_time DESC',
      [post_id]
    ),
    group_name = await Group.getWhatOfGrp(
      'name',
      _post[0] ? _post[0].group_id : 0
    ),
    post = {
      ..._post[0],
      tags_count,
      likes_count,
      shares_count,
      comments_count,
      group_name,
      comments,
    }

  res.json(post)
})

module.exports = app
