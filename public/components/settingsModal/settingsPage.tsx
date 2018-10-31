import * as React from 'react'
import XmltvFilesComponent from '../xmltvFiles/xmltvFiles'
import AppContext, { Settings, AppContextInterface } from '../appContext'
import { Constants } from '../../js/common'
import { SettingsService } from '../settingsService'
import filesServices from '../../js/filesService'
import { XmltvFile } from '../entities'

interface SettingsPageProps {
  zones: string[]
  files?: XmltvFile[]
  settings: Settings
}
interface SettingsPageState {
  files?: XmltvFile[]
  settings: Settings
}

export default class SettingsPage extends React.PureComponent<SettingsPageProps, SettingsPageState> {
  static contextType: React.Context<AppContextInterface> = AppContext

  state = {
    ...this.props,
  }
  constructor(props: SettingsPageProps) {
    super(props)
    this.halfHourWidthChanged.bind(this)
    this.onTzSelectChanged.bind(this)
    this.onXmltvFilesChangeCallback.bind(this)
  }

  /**
   *
   * @param e
   */
  halfHourWidthChanged = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ settings: { halfHourWidth: Number.parseInt(e.currentTarget.value) } }, () => {
      SettingsService.save(this.state.settings)
      this.context.onSettingsChanged()
    })
  }

  onTzSelectChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    this.setState({ settings: { tz: e.currentTarget.value } }, () => {
      SettingsService.save(this.state.settings)
      this.context.onSettingsChanged()
    })
  }

  onXmltvFilesChangeCallback = async (fileItemEvent: { type: string; file: XmltvFile }) => {
    switch (fileItemEvent.type) {
      case Constants.Events.LOAD_XMLTV_URL:
        if (this.state.files) {
          this.state.files.forEach(f => (f.selected = false))
          fileItemEvent.file.selected = true
          await filesServices.update(this.state.settings.MyJsonId, this.state.files)
        }
        break
      case Constants.Events.REMOVE_XMLTV_URL:
        if (this.state.files) {
          this.setState(
            prevState => {
              return {
                files: prevState.files.filter(f => f.url != fileItemEvent.file.url),
              }
            },
            async () => {
              await filesServices.update(this.state.settings.MyJsonId, this.state.files)
            }
          )
        }
        break
      case Constants.Events.ADD_XMLTV_URL:
        if (this.state.files) {
          fileItemEvent.file.selected = true
          this.state.files.forEach(element => {
            element.selected = false
          })
          this.setState(
            prevState => {
              return {
                files: [fileItemEvent.file, ...(prevState.files || [])],
              }
            },
            async () => {
              await filesServices.update(this.state.settings.MyJsonId, this.state.files)
            }
          )
        }
        break
    }
  }

  render() {
    const halfHourInput = (
      <div className="form-group">
        <label htmlFor="formControlRange">Half hour width</label>
        <input
          className="form-control-range"
          type="range"
          min="50"
          max="250"
          step="50"
          value={this.state.settings.halfHourWidth}
          onChange={this.halfHourWidthChanged}
        />
      </div>
    )

    const timeZone = (
      <div className="form-group">
        <label htmlFor="xmltv_list" className="col-form-label">
          Time zone
        </label>
        <select className="form-control" id="zone_lit" onChange={this.onTzSelectChanged} value={this.state.settings.tz}>
          {this.props.zones.map((e, key) => {
            return (
              <option key={key} value={e}>
                {e}
              </option>
            )
          })}
        </select>
      </div>
    )

    return (
      <div>
        <h1>Settings</h1>
        <div className="container">
          <form className="form">
            {halfHourInput}
            {timeZone}
          </form>
          <XmltvFilesComponent files={this.state.files} onChangeCallback={this.onXmltvFilesChangeCallback} />
        </div>
      </div>
    )
  }
}
