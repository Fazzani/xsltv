import React from "react";
import Clock from "./clock";
import AppContext, { AppContextInterface } from "../appContext";

export default class NavBottom extends React.Component {
  static contextType: React.Context<AppContextInterface> = AppContext;
  render() {
    return (
      <nav className="navbar fixed-bottom navbar-dark bg-dark  form-inline justify-content-between">
        {this.context.settings && <Clock tz={this.context.settings.tz} />}
        <small>
          Created with <i className="fa fa-heart" /> by
          <a href="http://synker.ovh"> Synker.ovh</a>
        </small>
      </nav>
    );
  }
}
