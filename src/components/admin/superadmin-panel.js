import React, { Component } from 'react'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import TextInput from '../others/input/text'
import { post, get } from 'axios'
import Notify from 'handy-notification'
import { uData } from '../../utils/utils'
import { Redirect } from 'react-router-dom'

export default class SuperAdminPanel extends Component {
  state = {
    users: [],
    loading: true,
    // Create User form
    c_username: '',
    c_firstname: '',
    c_surname: '',
    c_email: '',
    c_password: '',
    // Reset password form
    r_username: '',
    r_password: '',
    // Update User edit mode
    edit_id: null,
    u_username: '',
    u_firstname: '',
    u_surname: '',
    u_email: '',
  }

  componentDidMount = () => {
    this.loadUsers()
  }

  loadUsers = async () => {
    try {
      const { data } = await get('/api/superadmin/get-users')
      if (data.success) {
        this.setState({ users: data.users, loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  changeValue = (what, e) => this.setState({ [what]: e.target.value })

  handleCreateUser = async e => {
    e.preventDefault()
    const { c_username, c_firstname, c_surname, c_email, c_password } = this.state
    if (!c_username || !c_firstname || !c_surname || !c_email || !c_password) {
      return Notify({ value: 'All fields are required!' })
    }
    
    const { data } = await post('/api/superadmin/create-user', {
      username: c_username,
      firstname: c_firstname,
      surname: c_surname,
      email: c_email,
      password: c_password
    })

    Notify({ value: data.mssg })
    if (data.success) {
      this.setState({
        c_username: '',
        c_firstname: '',
        c_surname: '',
        c_email: '',
        c_password: ''
      })
      this.loadUsers()
    }
  }

  handleResetPassword = async e => {
    e.preventDefault()
    const { r_username, r_password } = this.state
    if (!r_username || !r_password) {
      return Notify({ value: 'All fields are required!' })
    }

    const { data } = await post('/api/superadmin/reset-password', {
      username: r_username,
      password: r_password
    })

    Notify({ value: data.mssg })
    if (data.success) {
      this.setState({ r_username: '', r_password: '' })
    }
  }

  handleDeleteUser = async id => {
    if (!confirm('Are you sure you want to delete this user account? This cannot be undone.')) {
      return
    }

    const { data } = await post('/api/superadmin/delete-user', { id })
    Notify({ value: data.mssg })
    if (data.success) {
      this.loadUsers()
    }
  }

  handleToggleActivation = async (id, current_status) => {
    const nextStatus = current_status === 'yes' ? 'no' : 'yes'
    const confirmMsg = current_status === 'yes'
      ? 'Are you sure you want to deactivate this user account? They will not be able to log in.'
      : 'Are you sure you want to reactivate this user account?'
    
    if (!confirm(confirmMsg)) {
      return
    }

    try {
      const { data } = await post('/api/superadmin/toggle-activation', { id, is_active: nextStatus })
      Notify({ value: data.mssg })
      if (data.success) {
        this.loadUsers()
      }
    } catch (err) {
      Notify({ value: 'Something went wrong!' })
    }
  }

  startEdit = u => {
    this.setState({
      edit_id: u.id,
      u_username: u.username,
      u_firstname: u.firstname,
      u_surname: u.surname,
      u_email: u.email
    })
  }

  cancelEdit = () => {
    this.setState({ edit_id: null })
  }

  handleUpdateUser = async e => {
    e.preventDefault()
    const { edit_id, u_username, u_firstname, u_surname, u_email } = this.state
    if (!u_username || !u_firstname || !u_surname || !u_email) {
      return Notify({ value: 'Username, Full name, and Email fields cannot be empty!' })
    }

    const { data } = await post('/api/superadmin/update-user', {
      id: edit_id,
      username: u_username,
      firstname: u_firstname,
      surname: u_surname,
      email: u_email
    })

    Notify({ value: data.mssg })
    if (data.success) {
      this.setState({ edit_id: null })
      this.loadUsers()
    }
  }

  render() {
    const isSuper = uData('username') && uData('username').toLowerCase() === 'superadmin'
    if (!isSuper) {
      return <Redirect to="/" />
    }

    const {
      users,
      c_username,
      c_firstname,
      c_surname,
      c_email,
      c_password,
      r_username,
      r_password,
      edit_id,
      u_username,
      u_firstname,
      u_surname,
      u_email
    } = this.state

    return (
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <Title value="Superadmin Panel" desc="Manage users, reset passwords, and update users" />

        <FadeIn duration="300ms">
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#333' }}>Superadmin Control Panel</h2>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
            {/* Create User Section */}
            <div style={{ flex: '1', minWidth: '300px', background: '#fff', border: '1px solid #e4e4e4', borderRadius: '4px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Create User Account</h3>
              <form onSubmit={this.handleCreateUser}>
                <TextInput placeholder="Username" value={c_username} valueChange={e => this.changeValue('c_username', e)} required />
                <TextInput placeholder="First Name" value={c_firstname} valueChange={e => this.changeValue('c_firstname', e)} required />
                <TextInput placeholder="Last Name" value={c_surname} valueChange={e => this.changeValue('c_surname', e)} required />
                <TextInput placeholder="Email" type="email" value={c_email} valueChange={e => this.changeValue('c_email', e)} required />
                <TextInput placeholder="Password" type="password" value={c_password} valueChange={e => this.changeValue('c_password', e)} required />
                <input type="submit" value="Create Account" className="pri_btn" style={{ width: '100%', marginTop: '10px' }} />
              </form>
            </div>

            {/* Reset Password Section */}
            <div style={{ flex: '1', minWidth: '300px', background: '#fff', border: '1px solid #e4e4e4', borderRadius: '4px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Reset User Password</h3>
              <form onSubmit={this.handleResetPassword}>
                <TextInput placeholder="Username" value={r_username} valueChange={e => this.changeValue('r_username', e)} required />
                <TextInput placeholder="New Password" type="password" value={r_password} valueChange={e => this.changeValue('r_password', e)} required />
                <input type="submit" value="Reset Password" className="pri_btn" style={{ width: '100%', marginTop: '10px' }} />
              </form>
            </div>
          </div>

          {/* User List Section */}
          <div style={{ background: '#fff', border: '1px solid #e4e4e4', borderRadius: '4px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>User Directory ({users.length} Users)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e4e4e4', paddingBottom: '10px' }}>
                  <th style={{ padding: '10px 0', width: '20%' }}>Username</th>
                  <th style={{ width: '20%' }}>First Name</th>
                  <th style={{ width: '20%' }}>Last Name</th>
                  <th style={{ width: '20%' }}>Email</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ textAlign: 'right', width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isEditing = edit_id === u.id
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #e4e4e4' }}>
                      {isEditing ? (
                        <React.Fragment>
                          <td style={{ padding: '8px 0' }}>
                            <input
                              type="text"
                              value={u_username}
                              onChange={e => this.changeValue('u_username', e)}
                              style={{ width: '90%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={u_firstname}
                              onChange={e => this.changeValue('u_firstname', e)}
                              style={{ width: '90%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={u_surname}
                              onChange={e => this.changeValue('u_surname', e)}
                              style={{ width: '90%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              value={u_email}
                              onChange={e => this.changeValue('u_email', e)}
                              style={{ width: '95%', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: u.is_active === 'yes' ? '#e2f9e4' : '#fff0f0',
                              color: u.is_active === 'yes' ? '#1db954' : '#ff3b30'
                            }}>
                              {u.is_active === 'yes' ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={this.handleUpdateUser}
                              className="pri_btn"
                              style={{ padding: '4px 10px', fontSize: '12px', marginRight: '5px' }}
                            >
                              Save
                            </button>
                            <button
                              onClick={this.cancelEdit}
                              className="sec_btn"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                            >
                              Cancel
                            </button>
                          </td>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <td style={{ padding: '12px 0', fontWeight: '600' }}>@{u.username}</td>
                          <td>{u.firstname}</td>
                          <td>{u.surname}</td>
                          <td>{u.email}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              background: u.is_active === 'yes' ? '#e2f9e4' : '#fff0f0',
                              color: u.is_active === 'yes' ? '#1db954' : '#ff3b30'
                            }}>
                              {u.is_active === 'yes' ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => this.handleToggleActivation(u.id, u.is_active)}
                              className="sec_btn"
                              style={{
                                padding: '4px 10px',
                                fontSize: '12px',
                                marginRight: '5px',
                                color: u.is_active === 'yes' ? '#ff9500' : '#1db954',
                                borderColor: u.is_active === 'yes' ? '#ff9500' : '#1db954'
                              }}
                            >
                              {u.is_active === 'yes' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => this.startEdit(u)}
                              className="sec_btn"
                              style={{ padding: '4px 10px', fontSize: '12px', marginRight: '5px' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => this.handleDeleteUser(u.id)}
                              className="sec_btn"
                              style={{ color: '#ff3b30', borderColor: '#ff3b30', padding: '4px 10px', fontSize: '12px' }}
                            >
                              Delete
                            </button>
                          </td>
                        </React.Fragment>
                      )}
                    </tr>
                  )
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px 0', textAlign: 'center', color: '#999' }}>No user accounts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    )
  }
}
