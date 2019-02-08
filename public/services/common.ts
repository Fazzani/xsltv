export default class Common {
  static parseQueryString = () => {
    var str = window.location.search;
    var objURL: any = {};

    // @ts-ignore
    str.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function(
      $0,
      $1,
      $2,
      $3
    ) {
      objURL[$1] = $3;
    });
    return objURL;
  };

  static getTimeZones = async (key = "7X0X1YP2FQH1", format = "json") => {
    var res = await fetch(
      `//api.timezonedb.com/v2.1/list-time-zone?key=${key}&format=${format}`
    );
    if (!res.ok) {
      throw Error("Updating files was failed");
    }
    const { zones } = await res.json();
    return zones as TimeZone[];
  };
}

export interface TimeZone {
  countryCode: string;
  countryName: string;
  zoneName: string;
  gmtOffset: string;
  timestamp: number;
}

export class Constants {
  static Events = {
    SELECTED_XMLTV_CHANGED: "SELECTED_XMLTV_CHANGED",
    LOAD_XMLTV_URL: "LOAD_XMLTV_URL",
    ADD_XMLTV_URL: "ADD_XMLTV_URL",
    REMOVE_XMLTV_URL: "onRemoREMOVE_XMLTV_URLveXmltvUrl"
  };

  static OTHERS = {
    XMLTV_DATETIME_FORMAT: "yyyyMMddhhmmss ZZZ"
  };

  static get Urls() {
    return {
      MYJSON_API_URL: "https://api.myjson.com/bins/",
      ELASTIC_URL: "https://elastic.synker.ovh/epg/channels/_search"
    };
  }
}
