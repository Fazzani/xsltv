import * as React from 'react';
import './style.scss';

export interface SearchBoxProps {
  value?: string;
  submitCallback(value: string | number): void;
}

export class SearchBoxState {
  value: string | number = '';
}

export class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
  constructor(props: SearchBoxProps) {
    super(props);
    this.state = { value: props.value || '' };
  }

  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    e.preventDefault();
    this.setState({ value: (e.target as HTMLInputElement).value });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    return this.props.submitCallback && this.props.submitCallback(this.state.value);
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)} className="search">
        <div className="container-2 row-fluid">
          <span className="icon">
            <i className="fa fa-search" />
          </span>
          <input
            type="text"
            id="search"
            value={this.state.value}
            placeholder="Search..."
            onChange={e => {
              this.handleChange(e);
            }}
          />
        </div>
      </form>
    );
  }
}
