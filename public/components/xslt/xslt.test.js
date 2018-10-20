import React from 'react'
import { shallow } from 'enzyme'
import Xslt from './xslt'

describe('<Xslt/>', () => {
  it('matches the snapshot Xslt', () => {
    const tree = shallow(<Xslt onClick={() => {}} />)
    expect(tree).toMatchSnapshot()
  })
})
