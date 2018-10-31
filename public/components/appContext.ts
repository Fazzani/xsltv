import * as React from 'react'
import { DateTime } from 'luxon'
import { AppNotification, XmltvFile } from './entities'
import SettingsService, { Settings } from '../services/settingsService'

export interface AppContextInterface {
  name: string
  loader: Loader
  settings: Settings
  handleErrors?: any
  files?: XmltvFile[]
  notify(notification: AppNotification): void
  onSettingsChanged?(): void
  onFilesChanged?(): void
}

interface Loader {
  loading: boolean
  text: string
}

export const DefaultAppContext = {
  name: 'XViewer',
  loader: { loading: false, text: 'Loading' },
  files: [],
  notify: (notification: AppNotification) => {
    console.log(notification)
  },
  settings: {
    hours: 4,
    tz: DateTime.local().zoneName,
    halfHourWidth: 100,
    HighlightMovies: false,
    HighlightNew: false,
    MyJsonId: '',
  },
  onSettingsChanged: () => SettingsService.load(),
  handleErrors: (response: Response, origin = 'XViewer App') => {
    if (!response.ok) {
      throw Error(`${origin} : ${response.statusText}`)
    }
    return response
  },
}

const AppContext = React.createContext<AppContextInterface>(DefaultAppContext)

export const Zones: string[] = [
  'Europe/Warsaw',
  'Europe/Mariehamn',
  'Europe/Minsk',
  'Europe/Monaco',
  'Europe/Moscow',
  'Europe/Nicosia',
  'Europe/Oslo',
  'Europe/Paris',
  'Europe/Podgorica',
  'Europe/Prague',
  'Europe/Riga',
  'Europe/Rome',
  'America/Los_Angeles',
]

export default AppContext
