import * as React from 'react'
import parser from 'fast-xml-parser'
import { Channel, Program, INTERVALS } from '../entities'
import AppContext, { AppContextInterface } from '../appContext'
import moment from 'moment-timezone'
import './style.scss'
import { INTERVALS, MinutesPerDay } from './../entities'

interface HomeProps {
  xmltvFile: string
}
interface HomeState {
  tvgChannels: Channel[]
  currentDate: string
  halfHourWidth: number
  totalWidth: number
  offset: number
}

//TODO:  add navigation time
//TODO: fix le viewPort
//TODO: Gérér les tz
//TODO: Gérer les gaps
//TODO: Afficher les images
//TODO: Afficher la timebar

export default class Home extends React.Component<HomeProps, HomeState> {
  static contextType: React.Context<AppContextInterface> = AppContext

  constructor(props: HomeProps) {
    super(props)
    const halfHourWidth = 100
    this.state = { halfHourWidth, totalWidth: halfHourWidth * 49 }
  }
  async componentDidMount() {
    console.log(this.context)
    await this.loadFile(this.props.xmltvFile || 'https://raw.githubusercontent.com/Fazzani/grab/master/others.xmltv')
    console.log(this.context.settings.tz)
    const m = moment()
    this.setState({ currentDate: m.format('YYYY-MM-DD'), intervals: INTERVALS, offset: this.getTimeOffsetPerDay() })
  }

  getTimeOffsetPerDay = () => {
    const m = moment()
    m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    m.toISOString()
    m.format()
    return `-${moment().diff(m, 'h') * this.state.halfHourWidth * 2}px`
  }

  async loadFile(fileUrl: string) {
    // this.context.loader.loading = true
    const response = await fetch(fileUrl)
    this.context.handleErrors(response)
    const xmlString = await response.text()
    const docJson = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    })

    if (docJson.tv) {
      docJson.tv.programme.map(p => {
        p.startTime = moment(p.start, 'YYYYMMDDhhmmss [Z]')
        p.stopTime = moment(p.stop, 'YYYYMMDDhhmmss [Z]')
        p.duration = moment.duration(p.stopTime - p.startTime).as('minutes')
        p.coefficient = p.duration / 30
        p.durationPercent = Math.floor((p.duration / MinutesPerDay) * 100)
        p.width = this.state.halfHourWidth * p.coefficient
        return p
      })
      const tvgChannels = docJson.tv.channel.map(c => {
        c.programs = docJson.tv.programme.filter(p => p.channel === c.id)
        return c
      })

      console.log(tvgChannels)
      this.setState({ tvgChannels })
      this.context.loader.loading = false
    }
  }

  render() {
    const Programs = (programs: Program[]) => {
      return programs.map((p, i) => {
        return (
          <div className="listings-program" style={{ minWidth: p.width }} key={i}>
            <div className="listings-program-title">{p.title['#text']}</div>
            <div className="listings-details">
              <span className="listings-details-first">{p.duration}</span>
              {p.width}
            </div>
          </div>
        )
      })
    }

    const timeBar = (totalWidth: number) => {
      return (
        <li className="listings-timebar" style={{ width: this.state.halfHourWidth }}>
          {INTERVALS.map((x, i) => {
            return (
              <div className="listings-timebar-time" style={{ width: this.state.halfHourWidth }} key={i}>
                {x}
              </div>
            )
          })}
        </li>
      )
    }

    const Channels =
      this.state &&
      this.state.tvgChannels &&
      this.state.tvgChannels !== null &&
      this.state.tvgChannels.map((c, i) => {
        return (
          <li key={i} className="listings-channel-row">
            <div className="listings-channel" style={{ width: this.state.halfHourWidth }}>
              {c['display-name']['#text']}
            </div>
          </li>
        )
      })

    const Progs = this.state &&
      this.state.tvgChannels &&
      this.state.tvgChannels !== null && (
        <ul className="listings-grid-progs" style={{ width: this.state.totalWidth, left: this.state.offset }}>
          {timeBar(this.state.totalWidth)}
          {this.state.tvgChannels.map((c, i) => {
            return (
              <li key={i} className="col-md-12 listings-channel-row">
                {c.programs && Programs(c.programs)}
              </li>
            )
          })}
        </ul>
      )

    return (
      <React.Fragment>
        <h1>{this.context.name}</h1>
        <div className="epg-container">
          <ul className="listings-grid grid-channels">{Channels}</ul>
          <ul className="listings-grid grid-progs">{Progs}</ul>
        </div>
      </React.Fragment>
    )
  }
}
