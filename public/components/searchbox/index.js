import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

export class SearchBox extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="container-2 row-fluid">
        <span className="icon">
          <i className="fa fa-search" />
        </span>
        <input type="search" id="search" placeholder="Search..." />
      </div>
    );
  }
}

export default SearchBox;
