import React from 'react'
import { PropTypes } from 'prop-types'
import { Constants } from '../../services/common'

export default class XmltvFileItem extends React.PureComponent {
  static propTypes = {
    file: PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
      selected: PropTypes.bool,
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

  view = e => {
    e.preventDefault()
    if (this.props.itemCallback) {
      this.props.itemCallback({
        type: Constants.Events.LOAD_XMLTV_URL,
        file: this.createFileObject(this.props.file.url),
      })
    }
  }

  add = e => {
    e.preventDefault()
    if (this.props.itemCallback) {
      this.props.itemCallback({
        type: Constants.Events.ADD_XMLTV_URL,
        file: this.createFileObject(this.state.value),
      })
    }
    this.setState({ value: '' })
  }

  remove = e => {
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
    if (event.key === 'Enter') {
      this.add(event)
    }
  }

  /**
   * Generate xmltv object from url
   * @param {string} xmltv_file_url - xmltv file url
   * @memberof SettingsModal
   */
  createFileObject = xmltv_file_url => {
    return { name: xmltv_file_url.split('/').pop(), url: xmltv_file_url }
  }

  render() {
    const removeBtn = !this.state.isNew && (
      <button className="pull-right btn btn-sm border-0 rounded-circle btn-outline-danger" onClick={e => this.remove(e)}>
        <i className="fa fa-trash-o" />
      </button>
    )

    const inputUrl = this.state.isNew ? (
      <div className="col-8">
        <input
          type="url"
          value={this.state.value || ''}
          onChange={e => this.handleChange(e)}
          placeholder="Add new xmltv url..."
          className="form-control"
          onKeyPress={e=> this.handleChange(e)}
        />
      </div>
    ) : (
      this.props.file && <div className={'col ' + (this.props.file.selected ? 'selected' : '')}>{this.props.file.name}</div>
    )

    return (
      <div className="row xviewer-list-item">
        {inputUrl}
        <div className="col">
          <button className="pull-right btn btn-sm border-0 rounded-circle btn-outline-success" onClick={e => this.view(e)}>
            <i className="fa fa-eye" />
          </button>
          {this.state.isNew && (
            <button className="pull-right btn btn-sm border-0 rounded-circle btn-outline-primary" onClick={e => this.add(e)}>
              <i className="fa fa-plus" />
            </button>
          )}
          {removeBtn}
        </div>
      </div>
    )
  }
}
