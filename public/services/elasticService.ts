import { Constants } from "./common";

export default class elasticServices {
  static searchAsync = async (query: any): Promise<any> => {
    const options = {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    };
    let res = await fetch(`${Constants.Urls.ELASTIC_URL}`, options);
    if (!res.ok || res.status !== 200) {
      throw Error("Request Elastic failed");
    }
    const result = await res.json();
    return result.hits.hits[0];
  };
}
