import * as React from 'react'
import 'bootstrap'
import $ from 'jquery'
import SideMenu from './sidemenu/sidemenu'
import Loader from './loader/loader'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import routes from '../routes'
import NavBottom from './navBottom'
import SnackBar from './snackBar/snackBar'
import AppContext from './appContext'
import { toast } from 'react-toastify'
import '../styles/style.scss'

interface AppState {}

export default class App extends React.Component<void, AppState> {
  static contextType = AppContext
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
