export default class Common {
  static parseQueryString = () => {
    var str = window.location.search
    var objURL = {}

    // @ts-ignore
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
    REMOVE_XMLTV_URL: 'onRemoveXmltvUrl',
  }

  static get Urls() {
    return {
      MYJSON_API_URL: 'https://api.myjson.com/bins/',
    }
  }
}
