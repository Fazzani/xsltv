import { Constants } from './common'

export default class filesServices {

  static get = async (id?: string) => {
    if(!id) return null
    const res = await fetch(`${Constants.Urls.MYJSON_API_URL}${id}`)
    if (!res.ok) {
      throw Error('Fetching files was failed')
    }
    return res.json()
  }

  static update = async (id?: string, obj?: object) => {
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

  static add = async (obj: object) => {
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
