import * as React from 'react'
import './style.scss'

export interface SidePanelProps {
  open: boolean
  pullRight: boolean
  onSetOpen(e:any): void
}
export default class SidePanel extends React.PureComponent<SidePanelProps, {}> {
  render() {
    return (
      <div className={this.props.open ? 'sidepanel container open' : 'sidepanel container'}>
        <span className="exit" onClick={e => this.props.onSetOpen(e)}>
          x
        </span>
        {this.props.children}
      </div>
    )
  }
}
