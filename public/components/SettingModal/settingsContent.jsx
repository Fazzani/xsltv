import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Constants } from '../../js/common'
import $ from 'jquery'
import XmltvFilesComponent from '../xmltvFiles'
import { AppContext } from '../../index'
import { Tabs, Tab } from 'react-bootstrap-tabs'

export class SettingContent extends Component {
  static propTypes = {
    files: PropTypes.array.isRequired,
    callbackEvent: PropTypes.func,
  }
  static defaultProps = {
    files: [],
  }
  constructor(props) {
    super(props)
    // create a ref to store the textInput DOM element
    this.meRef = React.createRef()
  }

  componentDidUpdate() {
    if (this.props.files.length > 0) {
      this.selectedXmltvFile =
        this.props.files.filter((x) => x.selected)[0] || this.props.files[0]
    }
  }

  viewXmltvUrl = (e) => {
    e.preventDefault()
    if (this.props.callbackEvent) {
      this.props.callbackEvent({
        type: Constants.Events.LOAD_XMLTV_URL,
        file: this.createFileObject(this.xmltv_url.value),
      })
      $(this.meRef.current).modal('hide')
    }
  }

  addXmltvUrl = (e) => {
    e.preventDefault()
    if (this.props.callbackEvent) {
      this.props.callbackEvent({
        type: Constants.Events.ADD_XMLTV_URL,
        file: this.createFileObject(this.xmltv_url.value),
      })
      $(this.meRef.current).modal('hide')
    }
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
      <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
        <Tab label="Store">
          <AppContext.Consumer>
            {({ onSettingsModalCallback }) => (
              <XmltvFilesComponent
                files={this.props.files}
                onSettingsModalCallback={onSettingsModalCallback}
              />
            )}
          </AppContext.Consumer>
        </Tab>
        <Tab label="Global">Tab 1 content</Tab>
      </Tabs>
    )
  }
}

export default SettingsContent
