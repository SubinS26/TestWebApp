import React, { Component, Fragment } from 'react'
import TimeAgo from 'handy-timeago'
import PostOptionLists from './options-list'
import PropTypes from 'prop-types'
import MaterialIcon from '../../../../others/icons/material-icon'
import Overlay from '../../../../others/overlay'

export default class PostOptions extends Component {
  state = {
    showOptions: false,
  }

  toggleOptions = () => this.setState({ showOptions: !this.state.showOptions })

  render() {
    let {
      postDetails: { user, post_id, when, post_time, description },
      updateDescription,
    } = this.props
    let { showOptions } = this.state

    return (
      <div>
        <div className="p_i_2">
          <div className="p_time">
            <span>{post_time && TimeAgo(post_time).replace(/\s ago/, '')}</span>
          </div>
          <div className="p_h_opt">
            <span className="exp_p_menu" onClick={this.toggleOptions}>
              <MaterialIcon icon="expand_more" />
            </span>
          </div>
        </div>

        {showOptions && (
          <Fragment>
            <Overlay close_on_click close={this.toggleOptions} opacity={0.5} />
            <div
              className="options p_options"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
              }}
            >
              <PostOptionLists
                postDetails={{ user, post_id, when, description }}
                toggleOptions={this.toggleOptions}
                updateDescription={updateDescription}
              />
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}

PostOptions.propTypes = {
  postDetails: PropTypes.shape({
    user: PropTypes.number.isRequired,
    post_id: PropTypes.number.isRequired,
    when: PropTypes.string.isRequired,
    post_time: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  updateDescription: PropTypes.func.isRequired,
}
