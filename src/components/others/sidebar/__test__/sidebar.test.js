import React from 'react'
import SideBar from '../sidebar'
import { create } from 'react-test-renderer'
import { mount } from 'enzyme'
import MockDataElement from '../../../../utils/__mocks__/mock-dataElement'

describe('SideBar Component', () => {
  const comp = <SideBar uc={0} un={4} />
  let dataElement

  beforeAll(() => (dataElement = MockDataElement()))

  afterAll(() => dataElement.remove())

  it('should not show "Are you admin?" for regular users', () => {
    dataElement.setAttribute('data-username', 'takkar')
    dataElement.setAttribute('data-isadmin', 'false')
    const wrapper = mount(comp)
    expect(wrapper.find('.m_n_a_admin').exists()).toBe(false)
  })

  it('should show "Are you admin?" for superadmin account', () => {
    dataElement.setAttribute('data-username', 'superadmin')
    dataElement.setAttribute('data-isadmin', 'false')
    const wrapper = mount(comp)
    expect(wrapper.find('.m_n_a_admin').exists()).toBe(true)

    const tree = create(comp).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should mock admin-logout action when clicked', () => {
    dataElement.setAttribute('data-isadmin', 'true')
    const wrapper = mount(comp)

    wrapper.find('.admin-logout').simulate('click', { preventDefault() {} })
  })
})
