import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Constants } from "../../services/common";
import $ from "jquery";
import XmltvFilesComponent from "../xmltvFiles/xmltvFiles";
import { AppContext } from "../app";

class SettingsModal extends PureComponent {
  static propTypes = {
    files: PropTypes.array.isRequired,
    callbackEvent: PropTypes.func,
    open: PropTypes.bool
  };
  static defaultProps = {
    files: []
  };
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.meRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.files.length > 0) {
      this.selectedXmltvFile =
        this.props.files.filter(x => x.selected)[0] || this.props.files[0];
    }
  }

  viewXmltvUrl = e => {
    e.preventDefault();
    if (this.props.callbackEvent) {
      this.props.callbackEvent({
        type: Constants.Events.LOAD_XMLTV_URL,
        file: this.createFileObject(this.xmltv_url.value)
      });
      $(this.meRef.current).modal("hide");
    }
  };

  addXmltvUrl = e => {
    e.preventDefault();
    if (this.props.callbackEvent) {
      this.props.callbackEvent({
        type: Constants.Events.ADD_XMLTV_URL,
        file: this.createFileObject(this.xmltv_url.value)
      });
      $(this.meRef.current).modal("hide");
    }
  };
  /**
   * Generate xmltv object from url
   * @param {string} xmltv_file_url - xmltv file url
   * @memberof SettingsModal
   */
  createFileObject = xmltv_file_url => {
    return { name: xmltv_file_url.split("/").pop(), url: xmltv_file_url };
  };

  onXmltvSelectChange = e => {
    e.preventDefault();
    let file = this.props.files.find(x => x.url === e.target.value);
    file.selected = true;
    if (this.props.callbackEvent) {
      this.props.callbackEvent({
        type: Constants.Events.SELECTED_XMLTV_CHANGED,
        file
      });
      $(this.meRef.current).modal("hide");
    }
  };

  render() {
    const selectXmltv = this.selectedXmltvFile ? (
      <form id="xmltv_source">
        <div className="form-group">
          <label htmlFor="xmltv_list" className="col-form-label">
            Xmltv sources
          </label>
          <select
            className="form-control"
            id="xmltv_list"
            onChange={this.onXmltvSelectChange}
            value={this.selectedXmltvFile}
          >
            {this.props.files.map((e, key) => {
              return (
                <option key={key} value={e.url}>
                  {e.name}
                </option>
              );
            })}
          </select>
        </div>
      </form>
    ) : null;

    return (
      <div
        className="modal fade"
        id="settingsModal"
        tabIndex={-1}
        role="dialog"
        ref={this.meRef}
        aria-labelledby="exampleModalLabel"
        aria-hidden={this.props.open ? "false" : "true"}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Settings</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div id="accordion">
                <div className="card">
                  <div className="card-header" id="headingOne">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link btn-sm"
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Sources
                      </button>
                    </h5>
                  </div>

                  <div
                    id="collapseOne"
                    className="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      {selectXmltv}
                      <div className="input-group mb-3">
                        <form
                          className="form-inline"
                          ref={x => {
                            this.xmltv_file_form = x;
                          }}
                        >
                          <div className="form-group">
                            <input
                              type="url"
                              ref={x => {
                                this.xmltv_url = x;
                              }}
                              required
                              data-error="Please enter your full name."
                              className="form-control form-control-sm"
                              placeholder="xmltv url..."
                              pattern="(ftp|https?)://.+"
                            />
                            <div className="help-block with-errors" />
                          </div>

                          <div className="input-group-append">
                            <div className="btn-group" role="group">
                              <button
                                id="btnGroupDrop1"
                                type="button"
                                className="btn btn-outline-info btn-sm dropdown-toggle"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                              >
                                Dropdown
                              </button>
                              <div
                                className="dropdown-menu"
                                aria-labelledby="btnGroupDrop1"
                              >
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={this.viewXmltvUrl}
                                >
                                  View
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  onClick={this.addXmltvUrl}
                                >
                                  Add
                                </a>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingTwo">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed  btn-sm"
                        data-toggle="collapse"
                        data-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Settings
                      </button>
                    </h5>
                  </div>
                  <div
                    id="collapseTwo"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordion"
                  >
                    <div className="card-body">
                      <AppContext.Consumer>
                        {({ onSettingsModalCallback }) => (
                          <XmltvFilesComponent
                            files={this.props.files}
                            onSettingsModalCallback={onSettingsModalCallback}
                          />
                        )}
                      </AppContext.Consumer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingsModal;
