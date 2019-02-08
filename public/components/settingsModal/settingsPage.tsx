import * as React from "react";
import XmltvFilesComponent from "../xmltvFiles/xmltvFiles";
import AppContext, { AppContextInterface } from "../appContext";
import Common, { Constants, TimeZone } from "../../services/common";
import SettingsService, { Settings } from "../../services/settingsService";
import filesServices from "../../services/filesService";
import { XmltvFile } from "../entities";
import { Checkbox } from "../shared";

interface SettingsPageProps {
  files?: XmltvFile[];
  settings: Settings;
}
interface SettingsPageState {
  files?: XmltvFile[];
  settings: Settings;
  zones: TimeZone[];
}

export default class SettingsPage extends React.PureComponent<
  SettingsPageProps,
  SettingsPageState
> {
  static contextType: React.Context<AppContextInterface> = AppContext;

  state = {
    ...this.props,
    zones: []
  };

  constructor(props: SettingsPageProps) {
    super(props);
    this.halfHourWidthChanged.bind(this);
    this.onTzSelectChanged.bind(this);
    this.onXmltvFilesChangeCallback.bind(this);
    this.onSettingsInputChanged.bind(this);
  }

  async componentWillMount() {
    this.setState({ zones: await Common.getTimeZones() });
  }

  componentWillReceiveProps(nextProps: SettingsPageProps) {
    this.setState({ ...nextProps });
  }

  /**
   *
   * @param e
   */
  halfHourWidthChanged = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState(
      {
        settings: {
          ...this.state.settings,
          halfHourWidth: Number.parseInt(e.currentTarget.value)
        }
      },
      () => {
        SettingsService.save(this.state.settings);
        this.context.onSettingsChanged();
      }
    );
  };

  onSettingsInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState(
      {
        settings: {
          ...this.state.settings,
          [e.currentTarget.name]: e.currentTarget.checked
        }
      },
      () => {
        SettingsService.save(this.state.settings);
        this.context.onSettingsChanged();
      }
    );
  };

  onTzSelectChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    this.setState(
      { settings: { ...this.state.settings, tz: e.currentTarget.value } },
      () => {
        SettingsService.save(this.state.settings);
        this.context.onSettingsChanged();
      }
    );
  };

  onXmltvFilesChangeCallback = async (fileItemEvent: {
    type: string;
    file: XmltvFile;
  }) => {
    switch (fileItemEvent.type) {
      case Constants.Events.LOAD_XMLTV_URL:
        if (this.state.files) {
          this.state.files.forEach(f => (f.selected = false));
          this.state.files.filter(
            f => f.url === fileItemEvent.file.url
          )[0].selected = true;
          await filesServices.update(
            this.props.settings.MyJsonId,
            this.state.files
          );
          this.context.onFilesChanged();
        }
        break;
      case Constants.Events.REMOVE_XMLTV_URL:
        this.setState(
          prevState => {
            if (prevState.files)
              return {
                files: prevState.files.filter(
                  f => f.url != fileItemEvent.file.url
                )
              };
            else return {};
          },
          async () => {
            if (this.state.files) {
              const selectedFile = this.state.files.filter(f => f.selected);
              if (selectedFile.length === 0 && this.state.files.length > 0) {
                this.state.files[0].selected = true;
              }
            }
            await filesServices.update(
              this.props.settings.MyJsonId,
              this.state.files
            );
            this.context.onFilesChanged();
          }
        );
        break;
      case Constants.Events.ADD_XMLTV_URL:
        if (this.state.files) {
          fileItemEvent.file.selected = true;
          this.state.files.forEach(element => {
            element.selected = false;
          });
          this.setState(
            prevState => {
              return {
                files: [fileItemEvent.file, ...(prevState.files || [])]
              };
            },
            async () => {
              await filesServices.update(
                this.props.settings.MyJsonId,
                this.state.files
              );
              this.context.onFilesChanged();
            }
          );
        }
        break;
    }
  };

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
    );

    const timeZone = (
      <div className="form-group">
        <label htmlFor="xmltv_list" className="col-form-label">
          Time zone
        </label>
        <select
          className="form-control"
          id="zone_lit"
          onChange={this.onTzSelectChanged}
          value={this.state.settings.tz}
        >
          {this.state.zones.map((e: TimeZone, key) => {
            return (
              <option key={key} value={e.zoneName}>
                {e.zoneName}
              </option>
            );
          })}
        </select>
      </div>
    );
    return (
      <div>
        <h1>Settings</h1>
        <form className="form">
          <div className="card">
            <div className="card-header">General</div>
            <div className="card-body">
              {halfHourInput}
              {timeZone}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Highlights</div>
            <div className="card-body">
              <Checkbox
                checked={this.state.settings.HighlightNew}
                name="HighlightNew"
                label="Highlight new tv shows"
                handleInputChange={this.onSettingsInputChanged}
              />
              <Checkbox
                checked={this.state.settings.HighlightMovies}
                name="HighlightMovies"
                label="Highlight Movies"
                handleInputChange={this.onSettingsInputChanged}
              />
              <Checkbox
                checked={this.state.settings.HighlightSport}
                name="HighlightSport"
                label="Highlight Sports"
                handleInputChange={this.onSettingsInputChanged}
              />
            </div>
          </div>
          <div className="card">
            <div className="card-header">Source</div>
            <div className="card-body">
              <XmltvFilesComponent
                files={this.state.files}
                onChangeCallback={this.onXmltvFilesChangeCallback}
              />
            </div>
          </div>

          {/* {JSON.stringify(this.state)} */}
        </form>
      </div>
    );
  }
}
