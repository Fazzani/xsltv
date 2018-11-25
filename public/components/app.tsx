import * as React from 'react'
import 'bootstrap'
import SideMenu from './sidemenu/sidemenu'
import Loader from './loader/loader'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBottom from './navBottom/index'
import SnackBar from './snackBar/snackBar'
import AppContext, { AppContextInterface, DefaultAppContext } from './appContext'
import { toast } from 'react-toastify'
import '../styles/style.scss'
import filesServices from '../services/filesService'
import { AppNotification } from './entities'
import SettingsService from '../services/settingsService'
import About from './about'
import Home from './home'
import SettingsPage from './settingsModal/settingsPage'
import { DateTime } from 'luxon'

interface AppState extends AppContextInterface {
  noXmltvFiles?: boolean
  filesFetched: boolean
}
interface AppProps {
  notify(notification: AppNotification): void
}

export default class App extends React.Component<AppProps, AppState> {
  state: AppState = { ...DefaultAppContext, filesFetched: false, onSettingsChanged: () => this.reloadSettings }

  async componentDidMount() {
    this.setState(
      {
        settings: { ...this.state.settings, ...SettingsService.load() },
        onFilesChanged: async () => await this.fetchFiles(),
        toggleLoader: this.toggleLoader,
      },
      async () => {
        try {
          if (!this.state.settings.MyJsonId) {
            const result = await filesServices.add({ files: [] })
            const MyJsonId = result.uri.split('bins//')[1]
            this.setState({ settings: { ...this.state.settings, MyJsonId } }, async () => {
              SettingsService.save(this.state.settings)
              await this.fetchFiles()
            })
          } else {
            await this.fetchFiles()
          }
        } catch (error) {
          this.componentDidCatch(error, null)
        }
      }
    )
  }

  reloadSettings = () => {
    console.log('Reloading settings..')
    SettingsService.load()
    this.setState({ settings: { ...this.state.settings, ...SettingsService.load() } })
  }
  // @ts-ignore
  componentDidCatch(error, errorInfo) {
    this.props.notify({
      message: error.toString(),
      type: toast.TYPE.ERROR,
    })
  }

  handleErrors = (response: Response, origin = 'XViewer App') => {
    if (!response.ok) {
      throw Error(`${origin} : ${response.statusText}`)
    }
    return response
  }

  toggleLoader = (text: string = 'Loading', isLoading?: boolean) => {
    if (isLoading === undefined) {
      this.setState({ loader: { loading: !this.state.loader.loading, text } })
    } else {
      this.setState({ loader: { loading: isLoading, text } })
    }
  }

  fetchFiles = async () => {
    if (!this.state.settings.MyJsonId)
      this.setState({
        noXmltvFiles: true,
      })

    const response = await filesServices.get(this.state.settings.MyJsonId)

    if (response && response.length > 0) {
      this.setState({
        files: response,
        filesFetched: true,
      })
    } else {
      this.props.notify({
        message: 'No settings file was founded!',
        type: toast.TYPE.WARNING,
      })
      this.setState({
        noXmltvFiles: true,
        filesFetched: true,
      })
    }
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <Router>
          <section className="row-section">
            <SideMenu />
            <div className="container">
              <Route path="/about" render={() => <About />} />
              <Route path="/settings" render={() => <SettingsPage files={this.state.files} settings={this.state.settings} />} />
              <Route path="/" exact={true} render={() => this.state.filesFetched && <Home files={this.state.files} />} />
            </div>
            {this.state.loader && this.state.loader.loading ? <Loader displayText={this.state.loader.text} /> : null}
            <SnackBar />
            <NavBottom />
          </section>
        </Router>
      </AppContext.Provider>
    )
  }
}
