import React from 'react'
import SettingsModal from './settingsModal'
import { shallow } from 'enzyme'

describe('<SettingsModal/>', () => {
  Date.now = jest.fn(() => new Date(Date.UTC(2018, 10, 9, 8)).valueOf())

  it('matches the snapshot SettingsModal', () => {
    const tree = shallow(<SettingsModal />)
    expect(tree).toMatchSnapshot()
  })
})
