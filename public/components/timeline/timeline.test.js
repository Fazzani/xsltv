import React from 'react'
import { shallow } from 'enzyme'
import Timeline from './timeline'

describe('<Timeline/>', () => {
  it('matches the snapshot', () => {
    const tree = shallow(<Timeline />)
    expect(tree).toMatchSnapshot()
  })
})
