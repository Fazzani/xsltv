import { Constants } from './common'
export default class filesServices {
  static get = async (id) => {
    const res = await fetch(`${Constants.Urls.MYJSON_API_URL}${id}`)
    if (!res.ok) {
      throw Error('Fetching files was failed')
    }
    return res.json()
  }
  static update = async (id, obj) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify(obj),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
    const res = await fetch(`${Constants.Urls.MYJSON_API_URL}${id}`, options)
    if (!res.ok) {
      throw Error('Updating files was failed')
    }
    return res.json()
  }
  static add = async (obj) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
    const res = await fetch(`${Constants.Urls.MYJSON_API_URL}`, options)
    if (!res.ok || res.status !== 201) {
      throw Error('Creating files was failed')
    }
    return res.json()
  }
}
