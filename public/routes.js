// then our route config
import About from './components/about/index'
import SettingsPage from './components/settingsModal/settingsPage'
import Home from './components/home'

const routes = [
  {
    path: '/about',
    component: About,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
  {
    path: '/',
    exact: true,
    component: Home,
  },
]
export default routes
