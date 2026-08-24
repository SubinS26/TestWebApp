import React from 'react'
import { Me } from '../../../../utils/utils'
import { connect } from 'react-redux'
import BannerStat from './stat'

const BannerStats = props => {
  let {
    id,
    followers,
    followings,
    recommendations,
    profile_views,
    favourites,
    posts,
  } = props

  return (
    <div className="pro_bottom">
      <BannerStat disabled statType="posts" statValue={posts} />
      <BannerStat statType="followers" statValue={followers} />
      <BannerStat statType="followings" statValue={followings} />
      {Me(id) ? (
        <BannerStat statType="recommendations" statValue={recommendations} />
      ) : (
        <BannerStat statType="favourites" statValue={favourites} />
      )}
      <BannerStat disabled statType="profile views" statValue={profile_views} />
    </div>
  )
}

const mapStateToProps = state => ({
  id: state.User && state.User.user_details ? state.User.user_details.id : null,
  posts: state.Post && state.Post.posts ? state.Post.posts.length : 0,
  followers: state.Follow && state.Follow.followers ? state.Follow.followers.length : 0,
  followings: state.Follow && state.Follow.followings ? state.Follow.followings.length : 0,
  recommendations: state.Follow && state.Follow.recommendations ? state.Follow.recommendations.length : 0,
  favourites: state.Follow && state.Follow.favourites ? state.Follow.favourites.length : 0,
  profile_views: state.Follow ? state.Follow.profile_views : 0,
})

export default connect(mapStateToProps)(BannerStats)
