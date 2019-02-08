export interface Settings {
  hours?: number;
  tz?: string;
  halfHourWidth?: number;
  HighlightMovies?: boolean;
  HighlightNew?: boolean;
  HighlightSport?: boolean;
  MyJsonId?: string;
}

export default class SettingsService {
  public static load(key = "settings"): Settings {
    var settingsJson = localStorage.getItem(key);
    if (settingsJson == null) {
      return <Settings>{};
    }

    return JSON.parse(settingsJson);
  }

  public static save(settings: Settings, key = "settings") {
    localStorage.setItem(key, JSON.stringify(settings));
  }
}
