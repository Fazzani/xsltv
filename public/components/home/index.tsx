import * as React from 'react'
import parser from 'fast-xml-parser'
import { Channel, Program, INTERVALS, MinutesPerDay } from '../entities'
import AppContext, { AppContextInterface } from '../appContext'
import { DateTime, Interval } from 'luxon'
import './style.scss'
import 'bootstrap'
import SidePanel from '../sidePanel/sidePanel'
import TvgChannel from '../tvgChannel/tvgChannel'

interface HomeProps {
  xmltvFile: string
}
interface HomeState {
  //channel with programs for selected day only
  tvgChannelsDay: Channel[]
  // channel with all programs
  allTvgChannels: Channel[]
  selectedChannel: Channel | undefined
  selectedProgram: Program | undefined
  currentDate: DateTime
  halfHourWidth: number
  totalWidth: number
  offset: number
  channelLeftWidth: number
  sidebarOpen: boolean
  handleClosePanel: void
  intervals: string[]
}

//TODO: react optimizations
//TODO: prog detail
//TODO: Gérér les tz
//TODO: Gérer les gaps
//TODO: Gérer mobile version
//TODO: Afficher the vertical timebar

export default class Home extends React.PureComponent<HomeProps, HomeState> {
  static contextType: React.Context<AppContextInterface> = AppContext

  constructor(props: HomeProps) {
    super(props)
  }

  async componentDidMount() {
    // const testUrl = 'https://raw.githubusercontent.com/Fazzani/grab/master/fr_canal.xmltv'
    const testUrl = 'https://raw.githubusercontent.com/Fazzani/grab/master/others.xmltv'
    console.log(this.context.settings.tz)
    const current_date = DateTime.local()
    const halfHourWidth = 100
    this.setState(
      {
        currentDate: current_date,
        intervals: INTERVALS,
        halfHourWidth,
        totalWidth: halfHourWidth * 49,
        channelLeftWidth: halfHourWidth + 80,
        sidebarOpen: false,
      },
      async () => {
        this.setState({ totalWidth: halfHourWidth * 48 + this.state.channelLeftWidth, offset: this.getTimeOffsetPerDay() })
        await this.loadFile(this.props.xmltvFile || testUrl)
      }
    )
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
      docJson.tv.programme.map((p: Program) => {
        p.startTime = DateTime.fromFormat(p.start, 'yyyyMMddhhmmss ZZZ')
        p.stopTime = DateTime.fromFormat(p.stop, 'yyyyMMddhhmmss ZZZ')

        p.duration = Interval.fromDateTimes(p.startTime, p.stopTime).length('minute')
        p.coefficient = p.duration / 30
        p.durationPercent = Math.floor((p.duration / MinutesPerDay) * 100)
        p.width = this.state.halfHourWidth * p.coefficient
        p.id = `${p.channel}${p.start}`.replace(/[\s\+\.]/g,'')
        return p
      })

      const allTvgChannels = docJson.tv.channel.map((c: Channel) => {
        c.programs = docJson.tv.programme.filter((p: Program) => p.channel === c.id)
        return c
      })
      this.setState({ allTvgChannels }, () => {
        this.fetchPrograms()
      })
    }
  }

  fetchPrograms = () => {
    const currentDay = DateTime.local(this.state.currentDate.year, this.state.currentDate.month, this.state.currentDate.day)
    const tvgChannelsDay: Channel[] = []
    this.state.allTvgChannels.forEach((c: Channel) => {
      const ch = { ...c }
      ch.programs = c.programs
        .filter((p: Program) => {
          return (
            (p.startTime.diff(currentDay, 'minutes').minutes >= 0 && p.startTime.diff(currentDay, 'minutes').minutes <= MinutesPerDay) ||
            (p.stopTime.diff(currentDay, 'minutes').minutes >= 0 && p.stopTime.diff(currentDay, 'minutes').minutes <= MinutesPerDay)
          )
        })
        .slice()
      tvgChannelsDay.push(ch)
    })
    this.setState({ tvgChannelsDay })
    this.context.loader.loading = false
  }

  // calculate time offset from midnight
  getTimeOffsetPerDay = (): number => {
    const { year, month, day } = this.state.currentDate
    const dt = DateTime.local(year, month, day)
    const inter = Interval.fromDateTimes(dt, this.state.currentDate)
    // console.log(`Interval ${inter.length('hour')}`)
    return -(inter.length('hour') * this.state.halfHourWidth * 2)
  }

  onDayChanged = (e: React.MouseEvent<HTMLElement>, offset = 1) => {
    const date = this.state.currentDate.plus({ days: offset })
    this.setState({ currentDate: date }, () => {
      this.fetchPrograms()
    })
  }

  get PreviousDay(): DateTime {
    if (!this.state || !this.state.currentDate) return DateTime.local().plus({ days: -1 })
    return this.state.currentDate.plus({ days: -1 })
  }
  get NextDay(): DateTime {
    if (!this.state || !this.state.currentDate) return DateTime.local().plus({ days: +1 })
    return this.state.currentDate.plus({ days: +1 })
  }

  onSlide = (e: React.MouseEvent<HTMLElement>, isLeft: boolean = true) => {
    e.preventDefault()
    if (isLeft) {
      this.setState({ offset: this.state.offset + this.state.halfHourWidth })
    } else {
      this.setState({ offset: this.state.offset - this.state.halfHourWidth })
    }
  }

  onSelectChannel = (e: React.MouseEvent<HTMLElement>, c: Channel) => {
    e.preventDefault()
    this.setState({ selectedChannel: c, sidebarOpen: true })
  }

  onSelectProgram(e: React.MouseEvent<HTMLElement>, p: Program): void {
    e.preventDefault()
    this.setState({ selectedProgram: p })
  }

  handleClosePanel = () => {
    this.setState({ selectedChannel: undefined, sidebarOpen: false })
  }

  render() {
    const headerTimeBar = (totalWidth: number) => {
      return (
        <li className="listings-timebar">
          {INTERVALS.map(x => {
            return (
              <div className="listings-timebar-time" style={{ width: this.state.halfHourWidth }} key={x}>
                {x}
              </div>
            )
          })}
        </li>
      )
    }

    const Channels =
      this.state &&
      this.state.tvgChannelsDay &&
      this.state.tvgChannelsDay !== null &&
      this.state.tvgChannelsDay.map(c => {
        return (
          <li key={c.id} className="listings-channel-row">
            <div className="listings-channel" style={{ width: this.state.channelLeftWidth }}>
              <a href="#" onClick={e => this.onSelectChannel(e, c)}>
                {c.icon ? (
                  <img
                    src={c.icon.src}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={c['display-name']['#text']}
                    alt={c['display-name']['#text']}
                  />
                ) : (
                  c['display-name']['#text']
                )}
              </a>
            </div>
          </li>
        )
      })

    const Programs = (programs: Program[]) => {
      return programs.map(p => {
        return (
          <div className="listings-program" style={{ minWidth: p.width }} key={p.id}>
            <div className="listings-program-title">
              <a href="#" onClick={e => this.onSelectProgram(e, p)}>
                {p.title['#text']}
              </a>
            </div>
            <div className="listings-details">
              <span className="listings-details-first">{p.category && p.category['#text']}</span>
              {p['sub-title'] && p['sub-title']['#text']}
              {p.country && ' | ' + p.country['#text']}
              {p.duration && ' | ' + p.duration + 'min'}
              <div className="small">
                {p.startTime.toLocaleString(DateTime.TIME_24_SIMPLE)} &nbsp;-&nbsp; {p.stopTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
              </div>
            </div>
          </div>
        )
      })
    }

    const Progs = this.state &&
      this.state.tvgChannelsDay &&
      this.state.tvgChannelsDay !== null && (
        <ul className="listings-grid-progs" style={{ width: this.state.totalWidth, left: `${this.state.offset}px` }}>
          {headerTimeBar(this.state.totalWidth)}
          {this.state.tvgChannelsDay.map(c => {
            return (
              <li key={c.id} className="col-md-12 listings-channel-row">
                {c.programs && Programs(c.programs)}
              </li>
            )
          })}
        </ul>
      )

    const navigationButtons = (
      <div className="toolbar">
        <a
          href="#"
          className="previous-day pull-left"
          onClick={e => this.onDayChanged(e, -1)}
          data-toggle="tooltip"
          data-placement="top"
          title="Previous day">
          <i className="fa fa-angle-double-left" />
          {' ' + this.PreviousDay.toISODate()}
        </a>
        <a href="#" className="previous pull-left" onClick={e => this.onSlide(e)} data-toggle="tooltip" data-placement="top" title="Previous">
          <i className="fa fa-arrow-circle-left" />
        </a>

        <a href="#" className="next-day pull-right" onClick={e => this.onDayChanged(e)} data-toggle="tooltip" data-placement="top" title="Next day">
          {this.NextDay.toISODate() + ' '}
          <i className="fa fa-angle-double-right" />
        </a>
        <a href="#" className="next pull-right" onClick={e => this.onSlide(e, false)} data-toggle="tooltip" data-placement="top" title="Next">
          <i className="fa fa-arrow-circle-right" />
        </a>
      </div>
    )

    return (
      <React.Fragment>
        <h1>{this.context.name}</h1>
        <div className="epg-container">
          {navigationButtons}
          <ul className="listings-grid grid-channels">{Channels}</ul>
          <ul className="listings-grid grid-progs">{Progs}</ul>
        </div>
        {this.state && (
          <SidePanel open={this.state.sidebarOpen} pullRight={true} onSetOpen={this.handleClosePanel}>
            {this.state.selectedChannel && <TvgChannel channel={this.state.selectedChannel} />}
          </SidePanel>
        )}
      </React.Fragment>
    )
  }
}
