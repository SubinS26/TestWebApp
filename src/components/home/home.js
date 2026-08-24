import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import { getUnreadNotifications } from '../../actions/notification'
import { connect } from 'react-redux'
import { getFeed } from '../../actions/post'
import { getUserDetails } from '../../actions/user'
import Suggested from '../others/suggested/suggested'
import CreateGroup from '../group/create-group/create-group'
import PostItTeaser from '../post/post-it/post-it-teaser'
import { getUnreadMessages } from '../../actions/message'
import PopularHashtags from '../hashtag/popular-hashtags'
import { Instagram } from 'react-content-loader'
import { uData } from '../../utils/utils'
import Feed from './feed'

class Home extends Component {
  state = {
    loading: true,
  }

  componentDidMount = () => {
    let { dispatch } = this.props
    let username = uData('username')
    if (username) {
      dispatch(getUserDetails(username))
    }
    dispatch(getFeed())
    dispatch(getUnreadNotifications())
    dispatch(getUnreadMessages())
  }

  componentWillReceiveProps = () => this.setState({ loading: false })

  render() {
    let { loading } = this.state
    let { ud } = this.props
    let isNewUser = ud && ud.id && (!ud.bio || ud.bio.trim() === '')

    return (
      <div>
        <Title value="Home" />

        <FadeIn duration="300ms">
          <div className="senapati home_senapati">
            <div className="prajkumar">
              {isNewUser && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, #e7f3ff 0%, #ffffff 100%)',
                    border: '1px solid #1877f2',
                    borderRadius: 8,
                    padding: '16px 20px',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1877f2' }}>
                      👋 Complete Your Profile Setup
                    </div>
                    <div style={{ fontSize: 13, color: '#65676b', marginTop: 4 }}>
                      Add your bio, avatar, and video interests to personalize your experience.
                    </div>
                  </div>
                  <NavLink
                    to="/create-profile"
                    className="pri_btn"
                    style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    Set Up Profile &rarr;
                  </NavLink>
                </div>
              )}

              <PostItTeaser type="user" disabled={loading} />

              {loading && (
                <div style={{ marginTop: 20 }}>
                  <Instagram />
                  <Instagram />
                  <Instagram />
                </div>
              )}

              <Feed />
            </div>

            <div className="srajkumar">
              <Suggested when="home" />
              <PopularHashtags />
              {!loading && <CreateGroup />}
            </div>
          </div>
        </FadeIn>
      </div>
    )
  }
}

const mapStateToProps = store => ({
  store,
  ud: store.User.user_details,
})

export default connect(mapStateToProps)(Home)
export { Home as PureHome }
