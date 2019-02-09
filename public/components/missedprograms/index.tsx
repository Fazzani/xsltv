import * as React from 'react'
import elasticServices from '../../services/elasticService'
import './style.scss'

export class MissedProgramsState {
  value: string = ''
  query?: object
  result?: any
  groups: any[string]
  status: number = -1
  size: number = 1000
  groupFilter: string = 'all'
}

export interface IQuery {
  field: string
  value: string
}

export default class MissedPrograms extends React.Component<{}, MissedProgramsState> {
  constructor(props: any) {
    super(props)
    this.state = { value: '', status: -1, size: 1000, groups: [], groupFilter: 'all' }
  }

  async componentDidMount() {
    var allChannels = await elasticServices.searchAsync(this.queryFactory())
    this.setState({ result: allChannels.inner_hits.channels_without_epg.hits.hits }, () => {
      this.setGroups()
    })
  }

  setGroups = () => {
    const groups: any[string] = this.state.result.reduce(
      (groups: any[string], item: any) => ({
        ...groups,
        [item._source.url]: [...(groups[item._source.url] || []), item],
      }),
      {}
    )

    groups['all'] = this.state.result
    this.setState({ groups })
  }

  queryFactory = () => {
    const queryBase: any = {
      from: 0,
      size: 1,
      _source: false,
      query: {
        nested: {
          path: 'tv.channel',
          score_mode: 'avg',
          query: {
            bool: {
              should: [],
            },
          },
          inner_hits: {
            name: 'channels_without_epg',
            size: this.state.size,
          },
        },
      },
    }
    if (this.state.status !== undefined && this.state.status !== -1) {
      queryBase.query.nested.query.bool.should.push({
        match: {
          'tv.channel.active': this.state.status === 1,
        },
      })
    }
    if (this.state.value && this.state.value !== '') {
      // console.log(`${this.state.value}`)
      queryBase.query.nested.query.bool.should.push({
        wildcard: {
          'tv.channel.id': { value: '*' + this.state.value + '*', boost: 2.0 },
        },
      })
      queryBase.query.nested.query.bool.should.push({
        wildcard: {
          'tv.channel.url': '*' + this.state.value + '*',
        },
      })
    }
    return queryBase
  }

  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    e.preventDefault()
    this.setState({ value: (e.target as HTMLInputElement).value }, async () => {
      const result = await elasticServices.searchAsync(this.queryFactory())
      this.setState({ result: result.inner_hits.channels_without_epg.hits.hits }, () => {
        this.setGroups()
      })
    })
  }

  handleChangeStatus(e: React.ChangeEvent<HTMLSelectElement>): void {
    e.preventDefault()
    this.setState({ status: Number.parseInt(e.target.value) }, async () => {
      const result = await elasticServices.searchAsync(this.queryFactory())
      this.setState({ result: result.inner_hits.channels_without_epg.hits.hits }, () => {
        this.setGroups()
      })
    })
  }

  handleChangeGroups(e: React.ChangeEvent<HTMLSelectElement>): void {
    e.preventDefault()
    this.setState({ groupFilter: e.target.value, result: this.state.groups[e.target.value] })
  }

  render() {
    const ChannelIcon = ({ ch }) => {
      return ch._source.icon ? <img className="card-img-top" src={ch._source.icon.src} alt="Card image cap" style={{ width: '5rem' }} /> : null
    }
    const ListChannels = (props: any) => {
      return props && props.value ? (
        props.value.map((channel: any, i: number) => (
          <div
            className={'card text-white bg-primary mb-3 ' + (channel._source.active ? 'enabled' : 'disabled')}
            key={channel._source.id + i}
            style={{ width: '18rem' }}>
            <ChannelIcon ch={channel} />
            <div className="card-body">
              <h5 className="card-title">{channel._source.id}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{channel._source.country}</h6>
              <p>{channel._source.url}</p>
            </div>
          </div>
        ))
      ) : (
        <div>No Result</div>
      )
    }

    return (
      <div className="container">
        <div className="form-group">
          <input
            placeholder="find channels"
            className="form-control"
            type="text"
            value={this.state.value}
            autoFocus
            onChange={e => {
              this.handleChange(e)
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="statusChannelList">Channels groups</label>
          <select className="form-control" id="groupsChannelList" onChange={e => this.handleChangeGroups(e)}>
            {Object.keys(this.state.groups).map((g, i) => (
              <option value={g} selected={this.state.groupFilter === g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="statusChannelList">Channel status</label>
          <select className="form-control" id="statusChannelList" onChange={e => this.handleChangeStatus(e)}>
            <option value="-1">All</option>
            <option value="0">disabled</option>
            <option value="1">enabled</option>
          </select>
        </div>
        <div className="card-columns">
          <ListChannels value={this.state.result} />
        </div>
      </div>
    )
  }
}
