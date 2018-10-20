import React from 'react'
import Clock from './clock'

export class NavBottom extends React.PureComponent {
  render() {
    return (
      <nav className="navbar fixed-bottom navbar-dark bg-dark  form-inline justify-content-between">
        <Clock />
        <small>
          Created with <i className="fa fa-heart" /> by
          <a href="http://synker.ovh"> Synker.ovh</a>
        </small>
      </nav>
    )
  }
}

export default NavBottom
