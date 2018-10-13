import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/loader.scss'

export default class Loader extends Component {
  static propTypes = {
    displayText: PropTypes.string,
  }

  static defaultProps = {
    displayText: 'loading...',
  }
  render() {
    return (
      <div className="overlay">
        <div className="loading">
          <div className="spinner-wrapper">
            <span className="spinner-text">{this.props.displayText}</span>
            <span className="spinner" />
          </div>
        </div>
      </div>
    )
  }
}
