// ALL EXPLORE-RELATED ROUTES ARE HANDLED BY THIS FILE

const app = require('express').Router(),
  db = require('../../../config/db'),
  User = require('../../../config/User'),
  Group = require('../../../config/Group'),
  _ = require('lodash')

// USERS TO EXPLORE
app.post('/get-users-to-explore', async (req, res) => {
  let { id } = req.session,
    _users = await db.query(
      'SELECT users.id, users.username, users.firstname, users.surname FROM users WHERE users.id <> ? ORDER BY RAND() DESC LIMIT 12',
      [id]
    )

  let results = await Promise.all(
    _users.map(async u => {
      let [isFollowing, [{ followers_count = 0 } = {}], mutualUsers] = await Promise.all([
        User.isFollowing(id, u.id),
        db.query('SELECT COUNT(follow_id) AS followers_count FROM follow_system WHERE follow_to=?', [u.id]),
        User.mutualUsers(id, u.id),
      ])

      if (!isFollowing) {
        return {
          ...u,
          followers_count: Number(followers_count) || 0,
          mutualUsersCount: mutualUsers.length,
        }
      }
      return null
    })
  )

  let users = results.filter(Boolean)
  let orderByMutualUsers = _.orderBy(users, ['mutualUsersCount'], ['desc'])
  res.json(orderByMutualUsers)
})

// PHOTOS TO EXPLORE
app.post('/get-photos-to-explore', async (req, res) => {
  let photos = await db.query(
    'SELECT posts.post_id, posts.user, users.username, users.firstname, users.surname, posts.imgSrc AS imgsrc, posts.filter, posts.post_time FROM posts JOIN users ON posts.user = users.id WHERE users.account_type = "public" AND posts.imgSrc <> "" ORDER BY posts.post_id DESC LIMIT 40'
  )

  res.json(photos)
})

// GROUPS TO EXPLORE
app.post('/get-groups-to-explore', async (req, res) => {
  let { id } = req.session,
    _groups = await db.query(
      'SELECT group_id, name, admin, created FROM groups ORDER BY RAND() LIMIT 20'
    )

  let results = await Promise.all(
    _groups.map(async g => {
      let [[{ membersCount = 0 } = {}], mutualMembers, joined] = await Promise.all([
        db.query('SELECT COUNT(grp_member_id) AS membersCount FROM group_members WHERE group_id=?', [g.group_id]),
        Group.mutualGroupMembers(id, g.group_id),
        Group.joinedGroup(id, g.group_id),
      ])

      if (!joined) {
        return {
          ...g,
          membersCount: Number(membersCount) || 0,
          mutualMembersCount: mutualMembers.length,
          joined,
        }
      }
      return null
    })
  )

  let groups = results.filter(Boolean)
  let orderByMutualMembers = _.orderBy(groups, ['mutualMembersCount'], ['desc'])
  res.json(orderByMutualMembers)
})

// GET SUGGESTED USERS [REQ = USER]
app.post('/get-suggested-users', async (req, res) => {
  let { user } = req.body,
    { id } = req.session,
    _users = await db.query(
      'SELECT users.id, users.username, users.firstname, users.surname FROM users WHERE users.id <> ? ORDER BY RAND() DESC LIMIT 10',
      [id]
    )

  let results = await Promise.all(
    _users.map(async u => {
      let [isFollowing, mutualUsers] = await Promise.all([
        User.isFollowing(id, u.id),
        User.mutualUsers(id, u.id),
      ])

      if (!isFollowing) {
        return {
          ...u,
          mutualUsersCount: mutualUsers.length,
        }
      }
      return null
    })
  )

  let users = results.filter(Boolean)
  let filter = user ? users.filter(u => u.username != user) : users

  let orderByMutualUsers = _.orderBy(
    filter.slice(0, 5),
    ['mutualUsersCount'],
    ['desc']
  )

  res.json(orderByMutualUsers)
})

module.exports = app
