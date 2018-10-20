import React from 'react'
import Clock from './clock'
import renderer from 'react-test-renderer'

describe('<Clock/>', () => {
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
    jest.spyOn(Date, 'now').mockImplementation(() => 1530518207007)
    const tree = renderer.create(<Clock />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
