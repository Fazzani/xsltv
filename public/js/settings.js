export class SettingsService {
  static load(key = 'settings') {
    var settingsJson = localStorage.getItem(key)
    if (settingsJson == null) {
      return new Settings()
    }

    return JSON.parse(settingsJson)
  }

  static save(settings, key = 'settings') {
    localStorage.setItem(key, JSON.stringify(settings))
  }
}

export default class Settings {
  constructor(
    DisplayLength = 4,
    FixGaps = 1,
    OnClick = 'POPER',
    HighlightClickable = 1,
    HighlightMovies = 1,
    HighlightNew = 1
  ) {
    this.DisplayLength = DisplayLength
    this.FixGaps = FixGaps
    this.OnClick = OnClick //POPER, URL, IMDB
    this.HighlightClickable = HighlightClickable
    this.HighlightMovies = HighlightMovies
    this.HighlightNew = HighlightNew
    this.MyJsonId = ''
  }
}
