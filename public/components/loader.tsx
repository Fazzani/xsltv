import * as React from 'react';
import '../styles/loader.scss';

export interface LoaderProps {
  displayText: string;
}

export default class Loader extends React.Component<LoaderProps,{}> {

  static defaultProps = {
    displayText: 'loading...',
  };
  
  render() {
    return (
      <div className="overlay">
        <div className="loading">
          <div className="spinner-wrapper">
            <span className="spinner-text">{this.props.displayText}</span>
            <span className="spinner" />
          </div>
        </div>
      </div>
    );
  }
}
