export default class Common {
  static parseQueryString = () => {
    var str = window.location.search
    var objURL: any = {}

    // @ts-ignore
    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function($0, $1, $2, $3) {
      objURL[$1] = $3
    })
    return objURL
  }
}

export class Constants {
  static Events = {
    SELECTED_XMLTV_CHANGED: 'SELECTED_XMLTV_CHANGED',
    LOAD_XMLTV_URL: 'LOAD_XMLTV_URL',
    ADD_XMLTV_URL: 'ADD_XMLTV_URL',
    REMOVE_XMLTV_URL: 'onRemoREMOVE_XMLTV_URLveXmltvUrl',
  }

  static get Urls() {
    return {
      MYJSON_API_URL: 'https://api.myjson.com/bins/',
    }
  }
}
