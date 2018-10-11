/*eslint no-undef: "error"*/
/*eslint-env browser*/
import React, { Component } from 'react'
import { render } from 'react-dom'
import 'bootstrap'
import $ from 'jquery'
import './lang/english'
import XsltvProcessor from './js/xsltvProcessor'
import SettingsModal from './components/settingsModal'
import NavBottom from './components/NavBottom'
import SideMenu from './components/sideMenu'
import SnackBar from './components/snackbar'
import Header from './components/header'
import Settings from './js/settings'
import index_xsl from './index.xsl'
import { getParamsCurrentDate } from './components/shared'
import registerServiceWorker from './registerServiceWorker'
import Timeline from './components/timeline'
import Xslt from './components/xslt'
import { Constants } from './js/common'
import Loader from './components/loader'

export class App extends Component {
  static propTypes = {}
  constructor() {
    super()
    this.state = {
      loading: true,
      loaderText: 'Init App',
      files: [],
      xsltvProcessor: new XsltvProcessor(),
      AppSettings: Settings.load(),
      openSettingsModal: false,
    }
  }

  componentDidMount() {
    this.fetchFiles()
    
  }

  fetchFiles = () => {
    fetch(Constants.Urls.API_FILES)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.files.length > 0) {
          res.files.selected = true
          this.setState({
            files: res.files,
          })
          this.loadXSL(this.state.files[0])
        }
      })
      .catch((e) => console.error(e))
  }

  loadXSL(xmlfileneeded) {
    this.setState({
      loading: true,
      loaderText: 'Loading xslt file...',
    })
    fetch(index_xsl, {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
      .then((xsl) => {
        this.state.xsltvProcessor.processor.importStylesheet(xsl)
        this.loadXML(xmlfileneeded)
      })
      .catch((error) => {
        this.setState({
          loading: true,
          loaderText: error.message,
        })
      })
  }

  loadXML(xmlfileneeded) {
    if (xmlfileneeded) {
      this.setState({
        fragment: undefined,
        loading: true,
        loaderText: `Loading ${xmlfileneeded.name}...`,
      })
      if (window.XMLHttpRequest && window.XSLTProcessor) {
        fetch(xmlfileneeded.url, {
          method: 'GET',
        })
          .then((response) => response.text())
          .then((str) =>
            new window.DOMParser().parseFromString(str, 'text/xml')
          )
          .then((x) => {
            this.setState({
              xml: x,
              loading: true,
              loaderText: 'Preparing grid...',
            })
            this.Init(
              this.state.xsltvProcessor.AppSettings.DisplayLength,
              ...getParamsCurrentDate()
            )
          })
          .catch((error) => {
            this.setState({
              loading: true,
              loaderText: error.message,
            })
          })
      } else {
        alert("Your browser can't handle this script")
        return
      }
    }
  }

  onXsltClick = (e) => {
    let target = e.target.id === 'topcorner' ? e.target : e.target.parentNode

    if (target.attributes['data-onclick']) {
      e.preventDefault()
      // console.log(target.attributes['data-onclick'].value)
      eval('_this.' + target.attributes['data-onclick'].value)
    }
  }

  Init = (dl, ch, cd, cm, cy, offset) => {
    this.setState({
      loading: true,
      loaderText: 'Init xsltv file',
      fragment: undefined,
    })

    this.state.xsltvProcessor.initDate(ch, cd, cm, cy, offset)
    let fragment = this.state.xsltvProcessor.Init(this.state.xml, document)
    var helperDiv = document.createElement('div')
    helperDiv.appendChild(fragment)

    this.setState({ fragment: helperDiv.innerHTML, loading: false })
  }

  onSettingsModalClick = () => {
    this.setState({ openSettingsModal: !this.state.openSettingsModal })
    this.toggleSettingsModal()
  }

  onSettingsModalCallback = (e) => {
    switch (e.type) {
      case Constants.Events.SELECTED_XMLTV_CHANGED:
        this.loadXML(e.file)
        break
      case Constants.Events.LOAD_XMLTV_URL:
        this.loadXML(e.file)
        break
      case Constants.Events.ADD_XMLTV_URL:
        e.file.selected = true
        this.state.files.forEach((element) => {
          element.selected = false
        })
        this.setState({
          files: [e.file, ...this.state.files],
        })
        this.loadXML(e.file)
        break
    }
  }

  toggleSettingsModal = () => {
    const settingsModal = $('#settingsModal')
    if (settingsModal)
      settingsModal.modal(this.state.openSettingsModal ? 'show' : 'hide')
  }

  render() {
    return (
      <React.Fragment>
        <NavBottom />
        <section className="row-section">
          <SideMenu handleToggleModalClick={this.onSettingsModalClick} />
          <SettingsModal
            files={this.state.files}
            callbackEvent={this.onSettingsModalCallback}
          />
          <div className="container">
            <Header />
            <div className="row xstl-container" ref={(c) => (this.xsltRef = c)}>
              {this.state.fragment ? (
                <React.Fragment>
                  <Xslt
                    fragment={this.state.fragment}
                    onClick={this.onXsltClick}
                  />
                  <Timeline
                    parentNode={this.xsltRef}
                    startDate={this.state.xsltvProcessor.startDate}
                    hours={this.state.xsltvProcessor.AppSettings.DisplayLength}
                    leftchannelWidth={150}
                  />
                </React.Fragment>
              ) : null}
              {this.state.loading ? (
                <Loader displayText={this.state.loaderText} />
              ) : null}
            </div>
          </div>
          <SnackBar />
        </section>
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('app'))
registerServiceWorker()

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}
