import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../styles/file-items.scss'
import { Constants } from '../js/common'

export default class XmltvFilesComponent extends Component {
  static propTypes = {
    files: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
    onSettingsModalCallback: PropTypes.func,
  }

  render() {
    return (
      <div className="xviewer-list">
        {this.props.files.map((file, key) => {
          return (
            <XmltvFileItem
              file={file}
              key={key}
              itemCallback={this.props.onSettingsModalCallback}
            />
          )
        })}
        <XmltvFileItem
          isNew={true}
          itemCallback={this.props.onSettingsModalCallback}
        />
      </div>
    )
  }
}

class XmltvFileItem extends Component {
  static propTypes = {
    file: PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
    itemCallback: PropTypes.func,
    isNew: PropTypes.bool,
  }

  static defaultPropTypes = {
    isNew: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      isNew: props.isNew,
    }
  }

  componentDidMount() {
    this.setState({
      isNew: !this.props.file ? true : this.props.isNew,
    })
  }

  view = (e) => {
    e.preventDefault()
    if (this.props.itemCallback) {
      this.props.itemCallback({
        type: Constants.Events.LOAD_XMLTV_URL,
        file: this.createFileObject(this.props.file.url),
      })
    }
  }

  add = (e) => {
    e.preventDefault()
    if (this.props.itemCallback) {
      this.props.itemCallback({
        type: Constants.Events.ADD_XMLTV_URL,
        file: this.createFileObject(this.state.value),
      })
    }
    this.setState({ value: '' })
  }

  remove = (e) => {
    e.preventDefault()
    if (this.props.itemCallback) {
      this.props.itemCallback({
        type: Constants.Events.REMOVE_XMLTV_URL,
        file: this.createFileObject(this.props.file.url),
      })
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  /**
   * Generate xmltv object from url
   * @param {string} xmltv_file_url - xmltv file url
   * @memberof SettingsModal
   */
  createFileObject = (xmltv_file_url) => {
    return { name: xmltv_file_url.split('/').pop(), url: xmltv_file_url }
  }

  render() {
    return (
      <div className="row xviewer-list-item">
        {this.state.isNew ? (
          <div className="col-8">
            <input
              type="url"
              value={this.state.value || ''}
              onChange={(e) => this.handleChange(e)}
              placeholder="Add new xmltv url..."
              className="form-control"
            />
          </div>
        ) : (
          <div className="col">{this.props.file.name}</div>
        )}
        <div className="col">
          <button
            className="pull-right btn btn-sm border-0 rounded-circle btn-outline-success"
            onClick={(e) => this.view(e)}
          >
            <i className="fa fa-eye" />
          </button>
          {this.state.isNew && (
            <button
              className="pull-right btn btn-sm border-0 rounded-circle btn-outline-primary"
              onClick={(e) => this.add(e)}
            >
              <i className="fa fa-plus" />
            </button>
          )}
          {!this.state.isNew && (
            <button
              className="pull-right btn btn-sm border-0 rounded-circle btn-outline-danger"
              onClick={(e) => this.remove(e)}
            >
              <i className="fa fa-trash-o" />
            </button>
          )}
        </div>
      </div>
    )
  }
}
