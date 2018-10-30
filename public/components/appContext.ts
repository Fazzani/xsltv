import * as React from 'react'
import { DateTime } from 'luxon'

export interface AppContextInterface {
  name: string
  loader: Loader
  settings: Settings
  handleErrors: any
  files: any[]
}

interface Loader {
  loading: boolean
  text: string
}

export interface Settings {
  hours: number
  tz: string
  halfHourWidth: number
  onSettingsChanged(): void
  notify(): void
  HighlightMovies: boolean
  HighlightNew: boolean
  MyJsonId: string | undefined
}

const AppContext = React.createContext<AppContextInterface>({
  name: 'XViewer',
  loader: { loading: false, text: 'Loading' },
  files: [],
  settings: {
    hours: 4,
    tz: DateTime.local().zoneName,
    halfHourWidth: 100,
    onSettingsChanged: () => {},
    notify: () => {},
    HighlightMovies: false,
    HighlightNew: false,
    MyJsonId: '',
  },
  handleErrors: (response: Response, origin = 'XViewer App') => {
    if (!response.ok) {
      throw Error(`${origin} : ${response.statusText}`)
    }
    return response
  },
})

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
