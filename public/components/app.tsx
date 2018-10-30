import * as React from 'react'
import 'bootstrap'
import SideMenu from './sidemenu/sidemenu'
import Loader from './loader/loader'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import routes from '../routes'
import NavBottom from './navBottom'
import SnackBar from './snackBar/snackBar'
import AppContext from './appContext'
import { toast } from 'react-toastify'
import '../styles/style.scss'
import filesServices from '../js/filesService'
import { NotificationType } from './entities'
import { SettingsService } from './settingsService'

interface AppState {}
interface AppProps {
  notify(notification: NotificationType): void
}

export default class App extends React.Component<AppProps, AppState> {
  static contextType = AppContext

  async componentWillMount() {
    this.context = { ...this.props }
    try {
      this.context.settings = SettingsService.load()
      if (!this.context.settings.MyJsonId) {
        const result = await filesServices.add({ files: [] })
        this.context.settings.MyJsonId = result.uri.split('bins//')[1]
        SettingsService.save(this.context.settings)
      } else {
        await this.fetchFiles()
      }
    } catch (error) {
      this.componentDidCatch(error, null)
    }
  }

  // @ts-ignore
  componentDidCatch(error, errorInfo) {
    this.context.notify({
      message: error.toString(),
      errorInfo,
      type: toast.TYPE.ERROR,
    })
  }

  fetchFiles = async () => {
    const response = await filesServices.get(this.context.settings.MyJsonId)

    if (response && response.length > 0) {
      response[0].selected = true
      this.context.files = response
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
      <Router>
        <section className="row-section">
          <SideMenu />
          <div className="container">
            {routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
              <Route key={index} path={route.path} exact={route.exact} component={route.component} />
            ))}
          </div>
          {this.context.loader && this.context.loader.loading ? <Loader displayText={this.context.loader.text} /> : null}
          <SnackBar />
          <NavBottom />
        </section>
      </Router>
    )
  }
}
