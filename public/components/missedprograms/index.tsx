import * as React from 'react'
import { Constants } from '../../services/common'
import elasticServices from '../../services/elasticService'

export class MissedProgramsState {
  value: string = ''
  query?: object
  result?: any
}

export interface IQuery {
  field: string
  value: string
}

export default class MissedPrograms extends React.Component<{}, MissedProgramsState> {
  constructor(props: any) {
    super(props)
    this.state = { value: '' }
  }

  async componentDidMount() {
    var allChannels = await elasticServices.searchAsync(this.queryFactory())
    this.setState({ result: allChannels })
  }

  queryFactory = (active?: boolean, size: number = 1000) => {
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
              must: [],
            },
          },
          inner_hits: {
            name: 'channels_without_epg',
            size: size,
          },
        },
      },
    }
    if (active !== undefined) {
      queryBase.query.nested.query.bool.must.push({
        match: {
          'tv.channel.active': active,
        },
      })
    }
    if (this.state.value !== '') {
      console.log(`${this.state.value}`)
      queryBase.query.nested.query.bool.must.push({
        match: {
          'tv.channel.id': this.state.value,
        },
      })
    }
    return queryBase
  }

  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    e.preventDefault()
    this.setState({ value: (e.target as HTMLInputElement).value }, async () => {
      const result = await elasticServices.searchAsync(this.queryFactory())
      console.log(`result => ${result}`)
      this.setState({ result })
    })
  }

  render() {
    const ChannelIcon = ({ ch }) => {
      return ch._source.icon ? <img className="card-img-top" src={ch._source.icon.src} alt="Card image cap" style={{ width: '5rem' }} /> : null
    }
    const ListChannels = (props: any) => {
      return props && props.value && props.value.inner_hits.channels_without_epg ? (
        props.value.inner_hits.channels_without_epg.hits.hits.map((channel: any, i: number) => (
          <div className="card text-white bg-primary mb-3" key={channel._source.id + i} style={{ width: '18rem' }}>
            <ChannelIcon ch={channel} />
            <div className="card-body">
              <h5 className="card-title">{channel._source.country}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{channel._source.id}</h6>
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
            onChange={e => {
              this.handleChange(e)
            }}
          />
        </div>
        <div className="card-columns">
          <ListChannels value={this.state.result} />
        </div>
      </div>
    )
  }
}
