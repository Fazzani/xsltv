import React from 'react'
import { shallow } from 'enzyme'
import SideMenu from './sidemenu'

describe('<SideMenu/>', () => {
  it('matches the snapshot', () => {
    const tree = shallow(<SideMenu />)
    expect(tree).toMatchSnapshot()
  })
})
