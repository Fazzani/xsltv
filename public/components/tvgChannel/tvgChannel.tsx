import * as React from 'react'
import '../../styles/loader.scss'
import { TvgChannelProps } from './tvgChannel'
import './style.scss'
import moment from 'moment'
import $ from 'jquery'
import 'bootstrap'

export interface TvgChannelProps {
  channel: undefined | Channel
}

export interface Program {
  start: string
  stop: string
  title: TextProp
  category: any
  desc: TextProp
  icon: Icon
}

export interface Channel {
  id: string
  url: string
  icon: Icon
  'display-name': TextProp
  //@display-name: any;
  programs: Program[]
}

export interface Icon {
  src: string
}

export interface TextProp {
  '#text': string
  lang: string
}

export default class TvgChannel extends React.Component<TvgChannelProps, {}> {
  constructor(props: TvgChannelProps) {
    super(props)
  }

  handleClickCollapse = (e: any) => {
      $(e.target.attributes['data-target'].value).collapse('toggle')
  }

  getFormatedDateTime = (date: string) =>
    moment(date, 'YYYYMMDDHHmmss [Z]').format('hh:MM')

  render() {
    const categories = (cs: any[]) =>
      cs.map && cs.map((c, index) => <li key={index}>{c['#text']}</li>)
    const category = (c: any) => <span className="category">{c['#text']}</span>
    const listItems =
      this.props.channel &&
      this.props.channel.programs &&
      this.props.channel.programs.map((p, i) => (
        <li className="program-item row" key={i}>
          <span className="start">
            <h3>{this.getFormatedDateTime(p.start)}</h3>
          </span>
          <span className="content">
            <a
              className="title"
              data-toggle="collapse"
              data-target={'#' + i.toString()}
              onClick={(e) => this.handleClickCollapse(e)}
            >
              {p.title['#text']}
            </a>
            <div style={{float:'right'}}>{p.category && category(p.category)}</div>
            <div className="collapse" id={i.toString()}>
              <p className="desc">{p.desc && p.desc['#text']}</p>
            </div>
          </span>
          <span className="icon">
            {p.icon && <img src={p.icon.src} />}
          </span>
        </li>
      ))
    return (
      this.props.channel && (
        <div className="tvgChannel row">
          <div className="channel"> {this.props.channel.id} </div>
          <ul className="programs">{listItems}</ul>
        </div>
      )
    )
  }
}
