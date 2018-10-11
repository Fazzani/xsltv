export default class Common {
  static parseQueryString = () => {
    var str = window.location.search
    var objURL = {}

    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function(
      $0,
      $1,
      $2,
      $3
    ) {
      objURL[$1] = $3
    })
    return objURL
  }
}

export class Constants {
  static Events = {
    SELECTED_XMLTV_CHANGED: 'SELECTED_XMLTV_CHANGED',
    LOAD_XMLTV_URL: 'onViewXmltvUrl',
    ADD_XMLTV_URL: 'onAddXmltvUrl',
  }

  static get Urls() {
    return {
      API_FILES: 'https://api.myjson.com/bins/8tvgs',
      MYJSON_API_URL: 'https://api.myjson.com/bins/',
    }
  }
}