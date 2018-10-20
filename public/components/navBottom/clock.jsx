import React from 'react'
import moment from 'moment'

export default class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: moment(new Date()).format('LLLL') }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 60000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: moment(new Date()).format('LLLL'),
    })
  }

  render() {
    return (
      <span id="barclock">
        <p className="time">{this.state.date}</p>
      </span>
    )
  }
}
