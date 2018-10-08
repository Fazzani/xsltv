import React, { Component } from "react";
import { render } from "react-dom";
import "bootstrap";
import $ from "jquery";
import "./lang/english";
import XsltvProcessor from "./js/xsltvProcessor";
import SettingsModal from "./components/modal";
import NavBottom from "./components/NavBottom";
import SideMenu from "./components/sideMenu";
import SnackBar from "./components/snackbar";
import Header from "./components/header";
import Settings from "./js/settings";
import index_xsl from "./index.xsl";
import { Loader, api_files_url, getParamsCurrentDate } from "./components/shared";
import registerServiceWorker from "./registerServiceWorker";
import Timeline from "./components/timeline";

export class App extends Component {
  static propTypes = {};
  constructor() {
    super();
    this.state = {
      loading: true,
      loaderText: "Init App",
      files: [],
      xsltvProcessor: new XsltvProcessor(),
      AppSettings: Settings.load(),
      openSettingsModal: false
    };
  }

  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = () => {
    fetch(api_files_url)
      .then(res => res.json())
      .then(res => {
        if (res && res.files.length > 0) {
          this.setState({
            ...this.state,
            files: res.files
          });
          if (this.state.files.length > 0) {
            this.loadXSL(this.state.files[0]);
          }
        }
      })
      .catch(e => console.error(e));
  };

  loadXSL(xmlfileneeded) {
    this.setState({
      ...this.state,
      loading: true,
      loaderText: "Loading xslt file..."
    });
    fetch(index_xsl, {
      method: "GET"
    })
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(xsl => {
        this.state.xsltvProcessor.processor.importStylesheet(xsl);
        this.loadXML(xmlfileneeded);
      })
      .catch(error => {
        this.setState({
          ...this.state,
          loading: true,
          loaderText: error.message
        });
      });
  }

  loadXML(xmlfileneeded) {
    if (xmlfileneeded) {
      this.setState({ ...this.state, loading: true, loaderText: xmlfileneeded.name });
      if (window.XMLHttpRequest && window.XSLTProcessor) {
        fetch(xmlfileneeded.url, {
          method: "GET"
        })
          .then(response => response.text())
          .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
          .then(x => {
            this.setState({ ...this.state, xml: x, loading: true, loaderText: "Preparing grid..." });
            this.Init(this.state.xsltvProcessor.AppSettings.DisplayLength, ...getParamsCurrentDate());
          })
          .catch(error => {
            this.setState({
              ...this.state,
              loading: true,
              loaderText: error.message
            });
          });
      } else {
        alert("Your browser can't handle this script");
        return;
      }
    }
  }

  onXsltClick = e => {
    let target = e.target.id === "topcorner" ? e.target : e.target.parentNode;

    if (target.attributes["data-onclick"]) {
      e.preventDefault();
      console.log(target.attributes["data-onclick"].value);
      eval("_this." + target.attributes["data-onclick"].value);
    }
  };

  Init = (dl, ch, cd, cm, cy, offset) => {
    // let $tvFrame = $("#tvframe");
    this.setState({
      ...this.state,
      loading: true,
      loaderText: "Init xsltv file",
      fragment: undefined
    });

    this.state.xsltvProcessor.initDate(ch, cd, cm, cy, offset);
    let fragment = this.state.xsltvProcessor.Init(this.state.xml, document);
    var helperDiv = document.createElement("div");
    helperDiv.appendChild(fragment);

    //  let $far = $(fragment);
    // let $vline = $('<div id="vline"><span class="vheader"></span></div>');
    // $far.append($vline);
    //    $tvFrame.empty().append($far);
    this.setState({ ...this.state, fragment: helperDiv.innerHTML, loading: false, initHandler: this.Init });

    // //InitTimeline($tvFrame, $vline, this.state.xsltvProcessor.AppSettings.DisplayLength);

    // $tvFrame.show();
  };

  onAddXmltvUrl = xmltv_file => {
    console.log(`onAddXmltvUrl ${xmltv_file}`);
    this.setState({
      ...this.state,
      files: [xmltv_file, ...this.state.files]
    });
  };

  onViewXmltvUrl = xmltv_file => {
    console.log(`onViewXmltvUrl ${xmltv_file}`);
    this.setState({ ...this.state, openSettingsModal: false });
    this.toggleSettingsModal();
    this.loadXML(xmltv_file);
  };

  onSettingsModalClick = e => {
    this.setState({ openSettingsModal: !this.state.openSettingsModal, ...this.state });
    this.toggleSettingsModal();
  };

  toggleSettingsModal = () => {
    const settingsModal = $("#settingsModal");
    if (settingsModal) settingsModal.modal(this.state.openSettingsModal ? "show" : "hide");
  };

  render() {
    return (
      <React.Fragment>
        <NavBottom />
        <section className="row-section">
          <SideMenu handleToggleModalClick={this.onSettingsModalClick} />
          <SettingsModal files={this.state.files} onViewXmltvUrl={this.onViewXmltvUrl} onAddXmltvUrl={this.onAddXmltvUrl} />
          <div className="container">
            <Header />
            <div className="row" ref={c => (this.xsltRef = c)}>
              {this.state.fragment ? (
                <React.Fragment>
                  <Xslt fragment={this.state.fragment} onClick={this.onXsltClick} />
                  <Timeline parent={this.xsltRef} />
                </React.Fragment>
              ) : null}
              {this.state.loading ? <Loader displayText={this.state.loaderText} /> : null}
            </div>
          </div>
          <SnackBar />
        </section>
      </React.Fragment>
    );
  }
}

render(<App />, document.getElementById("app"));
registerServiceWorker();

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}

if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update");
  whyDidYouUpdate(React);
}

export default class Xslt extends Component {
  popperTab = [];

  componentDidMount() {
    this.InitPopperAndTooltip();
  }

  componentDidUpdate() {
    this.InitPopperAndTooltip();
  }

  componentWillUnmount = () => {
    this.popperTab = [];
  };

  InitPopperAndTooltip = () => {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]')
      .popover({
        html: true
      })
      .on("shown.bs.popover", data => {
        this.popperTab.push($(data.target));
      });

    $(document).on("click touchend", e => {
      e.preventDefault();
      let target = $(e.target);
      this.popperTab.forEach(x => {
        if (!target.is(x)) {
          x.popover("hide");
          this.popperTab = this.popperTab.slice(this.popperTab.indexOf(x), 1);
        }
      });
    });
  };

  createMarkup = html => {
    return { __html: html };
  };

  render() {
    return <div dangerouslySetInnerHTML={this.createMarkup(this.props.fragment)} onClick={this.props.onClick} />;
  }
}
