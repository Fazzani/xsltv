import React from 'react'
import { Link } from 'react-router-dom'

export default class SideMenu extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
    }
  }

  handleToggleClick(e) {
    e.preventDefault()
    this.setState({
      ...this.state,
      open: !this.state.open,
    })
  }

  render() {
    const openClassNames = this.state.open
      ? 'navbar navbar-fixed-left navbar-minimal animate open'
      : 'navbar navbar-fixed-left navbar-minimal animate'

    return (
      <nav onClick={e => this.handleToggleClick(e)} className={openClassNames} role="navigation">
        <div className="navbar-toggler animate">
          <i className="fa fa-align-justify" />
        </div>
        <ul className="navbar-menu animate">
          <li>
            <Link className="animate" to="/">
              <span className="desc animate"> Home </span>
              <span className="fa fa-home" />
            </Link>
          </li>
          <li>
            <Link className="animate" to="/settings">
              <span className="desc animate"> Settings </span>
              <span className="fa fa-cogs" />
            </Link>
          </li>
          <li>
            <Link className="animate" to="/about">
              <span className="desc animate"> Who We Are </span>
              <span className="fa fa-comment" />
            </Link>
          </li>
        </ul>
      </nav>
    )
  }
}
