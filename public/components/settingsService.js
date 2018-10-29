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