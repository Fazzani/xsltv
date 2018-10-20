import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../styles/file-items.scss'
import XmltvFileItem from './xmltvFileItem'

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
        {this.props.files &&
          this.props.files.map((file, key) => {
            return (
              <XmltvFileItem
                file={file}
                key={key}
                itemCallback={this.props.onSettingsModalCallback}
              />
            )
          })}
        <XmltvFileItem
          isNew
          itemCallback={this.props.onSettingsModalCallback}
        />
      </div>
    )
  }
}
