import React, { PureComponent } from "react";

export default class SideMenu extends PureComponent {
  constructor() {
    super();
    this.state = {
      open: true
    };
  }

  handleToggleClick(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      open: !this.state.open
    });
  }

  render() {
    const openClassNames = this.state.open ? "navbar navbar-fixed-left navbar-minimal animate open" : "navbar navbar-fixed-left navbar-minimal animate";

    return (
      <nav
        onClick={e => this.handleToggleClick(e)}
        className={openClassNames}
        role="navigation">
        <div className="navbar-toggler animate">
          <i className="fa fa-align-justify" />
        </div>
        <ul className="navbar-menu animate">
          <li>
            <a href="#about-us" className="animate">
              <span className="desc animate"> Who We Are </span>
              <span className="fa fa-home" />
            </a>
          </li>
          <li>
            <a href="#settingsMenu" className="animate" data-toggle="modal" data-target="#settingsModal">
              <span className="desc animate"> Settings </span>
              <i className="fa fa-cogs" />
            </a>
          </li>
          <li>
            <a href="#contact-us" className="animate">
              <span className="desc animate"> How To Reach Us </span>
              <span className="fa fa-comment" />
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
