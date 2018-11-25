import React from 'react'
import { DateTime } from 'luxon'

interface ClockState {
  date: DateTime
  tz: any
}

interface ClockProps {
  tz: any
}
export default class Clock extends React.PureComponent<ClockProps, ClockState> {
  timerID: any

  constructor(props: ClockProps) {
    super(props)
    this.state = {
      date: DateTime.local().setZone(this.props.tz),
      tz: this.props.tz,
    }
  }

  componentWillReceiveProps(nextProps: ClockProps) {
    if (this.state.tz !== nextProps.tz) {
      this.setState({ tz: nextProps.tz, date: DateTime.local().setZone(nextProps.tz) }, () => console.log(this.state.date.toString()))
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 60000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick = () => {
    this.setState({
      date: DateTime.local().setZone(this.state.tz),
    })
  }

  render() {
    return (
      <span id="barclock">
        <p className="time">{this.state.date.toString()}</p>
      </span>
    )
  }
}
