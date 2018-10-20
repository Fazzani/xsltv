import React from 'react'
import App from './app'
import renderer from 'react-test-renderer'

describe('<App/>', () => {
  global.XSLTProcessor = jest.fn(() => { })
  const constantDate = new Date('2018-01-01T12:00:00')

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super()
        return constantDate
      }
    }
  })

  it('matches the snapshot', () => {
    const tree = renderer.create(<App />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
