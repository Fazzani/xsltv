import * as React from 'react'
import XmltvFilesComponent from '../xmltvFiles/xmltvFiles'
import AppContext, { Settings, AppContextInterface, Zones } from '../appContext'
import { DateTime } from 'luxon'
import { Constants } from '../../js/common'
import { SettingsService } from '../settingsService'
import filesServices from '../../js/filesService'

interface SettingsPageProps extends Settings {
  files: { url: string; selected: boolean }[]
  zones: string[]
}
interface SettingsPageState extends Settings {
  files: { url: string; selected: boolean }[]
}

export default class SettingsPage extends React.PureComponent<SettingsPageProps, SettingsPageState> {
  static contextType: React.Context<AppContextInterface> = AppContext
  static defaultProps = { files: [] }
  constructor(props: SettingsPageProps) {
    super(props)
    this.halfHourWidthChanged.bind(this)
    this.onTzSelectChanged.bind(this)
    this.onXmltvFilesChangeCallback.bind(this)
  }

  //TODO: load settings before mounting the component (from routing)
  componentDidMount = async () => {
    try {
      if (!this.context.settings.MyJsonId) {
        this.setState({ files: this.props.files })
        const result = await filesServices.add({ files: [] })
        const id = result.uri.split('bins//')[1]
        this.context.settings.MyJsonId = id
        SettingsService.save(this.context.settings)
      } else {
        SettingsService.save(this.context.settings)
      }
    } catch (error) {
      //this.componentDidCatch(error, null)
    }
  }

  // // @ts-ignore
  // componentDidCatch(error, errorInfo) {
  //   this.state.notify({
  //     message: error.toString(),
  //     errorInfo,
  //     type: toast.TYPE.ERROR,
  //   })
  // }

  /**
   *
   * @param e
   */
  halfHourWidthChanged = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.context.settings.halfHourWidth = e.currentTarget.value
    SettingsService.save(this.context.settings)
    // this.context.settings.onSettingsChanged()
  }

  onTzSelectChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    this.context.settings.tz = e.currentTarget.value
    SettingsService.save(this.context.settings)
    // this.context.settings.onSettingsChanged()
  }

  onXmltvFilesChangeCallback = (fileItemEvent: { type: string; file: { url: string; selected: boolean } }) => {
    switch (fileItemEvent.type) {
      case Constants.Events.LOAD_XMLTV_URL:
        // this.loadXML(e.file)
        break
      case Constants.Events.REMOVE_XMLTV_URL:
        this.setState(
          prevState => {
            return {
              files: prevState.files.filter(f => f.url != fileItemEvent.file.url),
            }
          },
          async () => {
            await filesServices.update(this.context.settings.MyJsonId, this.state.files)
          }
        )
        break
      case Constants.Events.ADD_XMLTV_URL:
        fileItemEvent.file.selected = true
        this.state.files.forEach(element => {
          element.selected = false
        })
        this.setState(
          prevState => {
            return {
              files: [fileItemEvent.file, ...prevState.files],
            }
          },
          async () => {
            await filesServices.update(this.context.settings.MyJsonId, this.state.files)
          }
        )
        break
    }
    SettingsService.save(this.context.settings)
    //this.context.settings.onSettingsChanged()
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
          defaultValue={this.context.settings.halfHourWidth}
          onChange={this.halfHourWidthChanged}
        />
      </div>
    )

    const timeZone = (
      <div className="form-group">
        <label htmlFor="xmltv_list" className="col-form-label">
          Time zone
        </label>
        <select className="form-control" id="zone_lit" onChange={this.onTzSelectChanged} value={this.context.settings.tz}>
          {Zones.map((e, key) => {
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
          <XmltvFilesComponent files={this.props.files} onChangeCallback={this.onXmltvFilesChangeCallback} />
        </div>
      </div>
    )
  }
}
