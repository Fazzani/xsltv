/*eslint no-undef: "error"*/
/*eslint-env browser*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'bootstrap'
import $ from 'jquery'
import './lang/english'
import XsltvProcessor from './js/xsltvProcessor'
import SettingsModal from './components/settingsModal'
import NavBottom from './components/NavBottom'
import SideMenu from './components/sideMenu'
import Header from './components/header/header'
import Settings, { SettingsService } from './js/settings'
// @ts-ignore
import index_xsl from './index.xsl'
import { getParamsCurrentDate } from './components/shared'
import Timeline from './components/timeline'
import Xslt from './components/xslt'
import { Constants } from './js/common'
import Loader from './components/loader'
import filesServices from './js/filesService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SearchBox } from './components/searchbox'

export const AppContext = React.createContext({})

export default class App extends Component {
  static propTypes = { notify: PropTypes.func }
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      notify: props.notify,
      loaderText: 'Init App',
      files: [],
      xsltvProcessor: new XsltvProcessor(),
      AppSettings: SettingsService.load(),
      openSettingsModal: false,
      noXmltvFiles: false,
      modalSettingsOpen: false,
    }
  }

  async componentDidMount() {
    try {
      if (!this.state.AppSettings.MyJsonId) {
        const result = await filesServices.add({ files: [] })
        const id = result.uri.split('bins//')[1]
        this.setState(
          (prevState) => {
            return {
              AppSettings: { ...prevState.AppSettings, MyJsonId: id },
            }
          },
          async () => {
            SettingsService.save(this.state.AppSettings)
            await this.fetchFiles()
          }
        )
      } else {
        SettingsService.save(this.state.AppSettings)
        await this.fetchFiles()
      }
    } catch (error) {
      this.componentDidCatch(error)
    }
  }

  // @ts-ignore
  componentDidCatch(error, errorInfo) {
    this.state.notify({
      message: error.toString(),
      errorInfo,
      type: toast.TYPE.ERROR,
    })
  }

  fetchFiles = async () => {
    const response = await filesServices.get(this.state.AppSettings.MyJsonId)

    if (response && response.length > 0) {
      response[0].selected = true
      this.setState({
        files: response,
      })
      await this.loadXSL(response[0])
    } else {
      this.state.notify({
        message: 'no settings file founded!',
        type: toast.TYPE.WARNING,
      })
      this.setState({
        noXmltvFiles: true,
      })
      await this.loadXSL()
    }
  }

  /**
   *  Importing xsl as stylesheet
   * @param {object} xmlfileneeded - xmltv file object
   */
  async loadXSL(xmlfileneeded = null) {
    this.setState({
      loading: true,
      loaderText: 'Loading xslt file...',
    })

    const response = await fetch(index_xsl)
    if (this.state.noXmltvFiles) {
      this.handleErrors('Loading Xsl file', response)
      this.setState({
        loading: false,
      })
      this.toggleSettingsModal()
    }
    // @ts-ignore
    const xsl = new window.DOMParser().parseFromString(
      await response.text(),
      'text/xml'
    )
    this.state.xsltvProcessor.processor.importStylesheet(xsl)
    await this.loadXML(xmlfileneeded)
  }

  /**
   *  Loading Xmltv file
   * @param {object} xmlfileneeded - xmltv file object
   */
  async loadXML(xmlfileneeded) {
    if (xmlfileneeded) {
      this.setState({
        fragment: undefined,
        loading: true,
        loaderText: `Loading ${xmlfileneeded.name}...`,
      })
      // @ts-ignore
      if (window.XMLHttpRequest && window.XSLTProcessor) {
        const response = await fetch(xmlfileneeded.url)
        this.handleErrors('Loading xml file', response)
        // @ts-ignore
        const xml = new window.DOMParser().parseFromString(
          await response.text(),
          'text/xml'
        )
        this.setState({
          xml,
          loading: true,
          loaderText: 'Preparing grid...',
        })
        // @ts-ignore
        this.Init(
          this.state.xsltvProcessor.AppSettings.DisplayLength,
          ...getParamsCurrentDate(Date.now())
        )
      }
    } else {
      throw new Error("Your browser can't handle this script")
    }
  }

  /**
   * Init different params to xsl processor
   *
   * @param {number} dl - display length (displayed hours)
   * @param {number} ch - hour date
   * @param {number} cd - day date
   * @param {number} cm - month date
   * @param {number} cy- year date
   * @param {number} offset- decalage horaire
   * @memberof App
   */
  // @ts-ignore
  // @ts-ignore
  Init = (dl, ch, cd, cm, cy, offset) => {
    this.setState({
      loading: true,
      loaderText: 'Init xsltv file',
      fragment: undefined,
    })

    this.state.xsltvProcessor.initDate(ch, cd, cm, cy, offset)
    const fragment = this.state.xsltvProcessor.Init(this.state.xml, document)
    if (fragment === null)
      throw new Error('An error was occurred while processing the xml file...')
    const helperDiv = document.createElement('div')
    helperDiv.appendChild(fragment)

    this.setState({ fragment: helperDiv.innerHTML, loading: false })
  }

  handleErrors = (origin = 'XViewer App', response) => {
    if (!response.ok) {
      throw Error(`${origin} : ${response.statusText}`)
    }
    return response
  }

  /**
   * handle click on epg table corners. that's allow as to navigate
   * to next/previous hours
   *
   * @param {object} e- click event
   * @memberof App
   */
  onXsltClick = (e) => {
    let target = e.target.id === 'topcorner' ? e.target : e.target.parentNode

    if (target.attributes['data-onclick']) {
      e.preventDefault()
      // console.log(target.attributes['data-onclick'].value)
      eval('_this.' + target.attributes['data-onclick'].value)
    }
  }

  onSettingsModalClick = () => {
    this.setState({ openSettingsModal: !this.state.openSettingsModal })
    this.toggleSettingsModal()
  }

  onSettingsModalCallback = async (e) => {
    switch (e.type) {
      case Constants.Events.SELECTED_XMLTV_CHANGED:
        this.loadXML(e.file)
        break
      case Constants.Events.LOAD_XMLTV_URL:
        this.loadXML(e.file)
        break
      case Constants.Events.REMOVE_XMLTV_URL:
        this.setState(
          (prevState) => {
            return {
              files: prevState.files.filter((f) => f.url != e.file.url),
            }
          },
          async () => {
            await filesServices.update(
              this.state.AppSettings.MyJsonId,
              this.state.files
            )
            await this.loadXML(
              this.state.files.length > 0 ? this.state.files[0] : null
            )
          }
        )
        break
      case Constants.Events.ADD_XMLTV_URL:
        e.file.selected = true
        this.state.files.forEach((element) => {
          element.selected = false
        })
        this.setState(
          (prevState) => {
            return {
              files: [e.file, ...prevState.files],
            }
          },
          async () => {
            await filesServices.update(
              this.state.AppSettings.MyJsonId,
              this.state.files
            )
            await this.loadXML(e.file)
          }
        )
        break
    }
  }

  toggleSettingsModal = () => {
    this.setState(
      (prev) => {
        return {
          openSettingsModal: !prev.openSettingsModal,
        }
      },
      () => {
        const settingsModal = $('#settingsModal')
        if (settingsModal)
          settingsModal.modal(this.state.openSettingsModal ? 'show' : 'hide')
      }
    )
  }

  saveSettings = () => {
    // @ts-ignore
    Settings.save(this.state.AppSettings)
  }

  handleSearch = ({ value }) => {
    if (this.state.fragment && value) {
      const progs = document.querySelectorAll('#listings td')
      if (progs) {
        for (const v of progs) {
          const data = v.getAttribute('data-content')
          const title = v.getAttribute('data-original-title')

          if (
            data &&
            (title.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
              data.toLowerCase().indexOf(value.toLowerCase()) > -1)
          ) {
            v.classList.add('highlight-search')
          } else {
            v.classList.remove('highlight-search')
          }
        }
      }
    }
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          loadXML: this.loadXML,
          saveSettings: this.saveSettings,
          onSettingsModalCallback: this.onSettingsModalCallback,
        }}
      >
        <NavBottom />
        <section className="row-section">
          <SideMenu handleToggleModalClick={this.onSettingsModalClick} />
          <SettingsModal
            open={this.state.openSettingsModal}
            files={this.state.files}
            callbackEvent={this.onSettingsModalCallback}
          />
          <div className="container">
            <Header title="Xmltv viewer" />
            <SearchBox submitCallback={(v) => this.handleSearch(v)} />
            <div className="row xslt-container" ref={(c) => (this.xsltRef = c)}>
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
        </section>
      </AppContext.Provider>
    )
  }
}
