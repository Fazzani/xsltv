import React from 'react'
import App from './app'
import renderer from 'react-test-renderer'

describe('<App/>', () => {
  Date.now = jest.fn(() => new Date(Date.UTC(2018, 10, 9, 8)).valueOf())
  global.XSLTProcessor = jest.fn(() => {})

  it('matches the snapshot', () => {
    const tree = renderer.create(<App />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
