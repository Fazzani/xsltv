import React from 'react'
import { shallow } from 'enzyme'
import XmltvFileItem from './xmltvFileItem'

describe('<XmltvFileItem/>', () => {
  it('matches the snapshot XmltvFileItem', () => {
    const tree = shallow(<XmltvFileItem />)
    expect(tree).toMatchSnapshot()
  })
})
