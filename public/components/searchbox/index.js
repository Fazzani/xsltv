import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.scss'

export class SearchBox extends Component {
  static propTypes = { value: PropTypes.string, submitCallback: PropTypes.func }
  constructor(props) {
    super(props)
    this.state = { value: this.props.value || '' }
  }

  handleChange(e) {
    e.preventDefault()
    this.setState({ value: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    return (
      this.props.submitCallback && this.props.submitCallback(this.state.value)
    )
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <div className="container-2 row-fluid">
          <span className="icon">
            <i className="fa fa-search" />
          </span>
          <input
            type="text"
            id="search"
            value={this.state.value}
            placeholder="Search..."
            onChange={(e) => {
              this.handleChange(e)
            }}
          />
        </div>
      </form>
    )
  }
}

export default SearchBox
