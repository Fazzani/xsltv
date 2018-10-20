import React from 'react'
import { shallow } from 'enzyme'
import Loader from './loader'

describe('<Loader/>', () => {
  it('matches the snapshot', () => {
    const tree = shallow(<Loader />)
    expect(tree).toMatchSnapshot()
  })
})
