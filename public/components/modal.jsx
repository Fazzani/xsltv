import React, { Component } from "react";
import PropTypes from "prop-types";

export class SettingsModal extends Component {
  static propTypes = {
    files: PropTypes.array.isRequired,
    onViewXmltvUrl: PropTypes.func.isRequired,
    onAddXmltvUrl: PropTypes.func.isRequired
  };
  static defaultProps = {
    files: []
  };

  viewXmltvUrl = e => {
    e.preventDefault();
    this.props.onViewXmltvUrl(this.createFileObject(this.refs.xmltv_url.value));
  };
  addXmltvUrl = e => {
    e.preventDefault();
    this.props.onAddXmltvUrl(this.createFileObject(this.refs.xmltv_url.value));
  };

  createFileObject = xmltv_file_url => {
    return { name: xmltv_file_url.split("/").pop(), url: xmltv_file_url };
  };

  render() {
    return (
      <div
        className="modal fade"
        id="settingsModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden={this.props.open ? "false" : "true"}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Settings</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
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
                        aria-controls="collapseOne">
                        Sources
                      </button>
                    </h5>
                  </div>

                  <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                    <div className="card-body">
                      <form id="xmltv_source">
                        <div className="form-group">
                          <label htmlFor="xmlt_list" className="col-form-label">
                            Xmltv sources
                          </label>
                          <select className="form-control" id="xmlt_list">
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
                      <div className="input-group mb-3">
                        <form className="form-inline" ref="xmltv_file_form">
                          <div className="form-group">
                            <input
                              type="url"
                              ref="xmltv_url"
                              required="required"
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
                                aria-expanded="false">
                                Dropdown
                              </button>
                              <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <a className="dropdown-item" href="#" onClick={this.viewXmltvUrl}>
                                  View
                                </a>
                                <a className="dropdown-item" href="#" onClick={this.addXmltvUrl}>
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
                        aria-controls="collapseTwo">
                        Settings
                      </button>
                    </h5>
                  </div>
                  <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div className="card-body">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
                      skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                      single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
                      ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you
                      probably haven't heard of them accusamus labore sustainable VHS.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
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
