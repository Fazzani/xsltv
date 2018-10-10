/*eslint no-undef: "error"*/
/*eslint-env browser*/
import React from 'react'
import moment from 'moment'

export class NavBottom extends React.PureComponent {
  render() {
    return (
      <nav className="navbar fixed-bottom navbar-dark bg-dark  form-inline justify-content-between">
        <Clock />
        <small>
          Created with <i className="fa fa-heart" /> from
          <a href="http://synker.ovh"> Synker.ovh</a>
        </small>
      </nav>
    )
  }
}

class Clock extends React.Component {
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

export default NavBottom
