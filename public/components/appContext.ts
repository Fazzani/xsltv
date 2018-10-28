import * as React from 'react'
import { DateTime } from 'luxon';

export interface AppContextInterface {
  name: string
  loader: Loader
  settings: Settings
  handleErrors: any
}

interface Loader {
  loading: boolean
  text: string
}

interface Settings {
  hours: number
  tz: string
}

const AppContext = React.createContext<AppContextInterface>({
  name: 'XViewer',
  loader: { loading: false, text: 'Loading' },
  settings: { hours: 4, tz: DateTime.local().zoneName },
  handleErrors: (response: Response, origin = 'XViewer App') => {
    if (!response.ok) {
      throw Error(`${origin} : ${response.statusText}`)
    }
    return response
  },
})

export default AppContext
