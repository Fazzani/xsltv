import * as React from 'react'
import 'bootstrap'
import SideMenu from './sidemenu/sidemenu'
import Loader from './loader/loader'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBottom from './navBottom'
import SnackBar from './snackBar/snackBar'
import AppContext, { AppContextInterface, Zones, DefaultAppContext } from './appContext'
import { toast } from 'react-toastify'
import '../styles/style.scss'
import filesServices from '../js/filesService'
import { AppNotification } from './entities'
import { SettingsService } from './settingsService'
import About from './about'
import Home from './home'
import SettingsPage from './settingsModal/settingsPage'

interface AppState extends AppContextInterface {
  noXmltvFiles?: boolean
}
interface AppProps {
  notify(notification: AppNotification): void
}

export default class App extends React.Component<AppProps, AppState> {
  state: AppState = DefaultAppContext
  async componentDidMount() {
    try {
      if (!this.state.settings.MyJsonId) {
        const result = await filesServices.add({ files: [] })
        this.state.settings.MyJsonId = result.uri.split('bins//')[1]
        SettingsService.save(this.state.settings)
      } else {
        await this.fetchFiles()
      }
    } catch (error) {
      this.componentDidCatch(error, null)
    }
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

  fetchFiles = async () => {
    const response = await filesServices.get(this.context.settings.MyJsonId)

    if (response && response.length > 0) {
      response[0].selected = true
      this.setState({ files: response })
    } else {
      this.context.notify({
        message: 'No settings file was founded!',
        type: toast.TYPE.WARNING,
      })
      this.setState({
        noXmltvFiles: true,
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
              <Route path="/settings" render={() => <SettingsPage zones={Zones} files={this.state.files} settings={this.state.settings} />} />
              <Route path="/" exact={true} render={() => <Home files={this.state.files} />} />
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
