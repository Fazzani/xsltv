import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

export default class Timeline extends Component {
  static propTypes = {
    // startTimeMoment:PropTypes.string.isRequired,
    // hours:PropTypes.number.isRequired,
    // leftchannelWidth:PropTypes.number.isRequired
  };
  static defaultProps = {
    hours: 4
  };

  constructor(props) {
    super(props);
    this.vline = React.createRef();
    this.state = {
      style: { marginLeft: 0 }
    };
  }

  componentDidMount() {
    if (this.props.parent != undefined) console.log(`parent.clientWidth: ${this.props.parent.clientWidth}`);
    //   let startTimeInit = $tvFrame.find('th.time[onclick^=Init]').attr('onclick');
    //   let startTime = (startTimeInit.split('Init(')[1].split(')')[0]).split(',');
    //   let startTimeMoment = `${startTime[2]}-${startTime[3]}-${startTime[4]} ${startTime[1]}:00:00`;
    let paddingLeft = undefined;

    this.interval = setInterval(() => {
      if (undefined == paddingLeft) {
        paddingLeft = (this.props.leftchannelWidth / this.props.parent.clientWidth) * 100;
      }
      this.setState({
        style: { marginLeft: this.percentElapsedTimeNowByDay(this.props.startTimeMoment, this.props.hours) + paddingLeft + "%" }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  percentElapsedTimeNowByDay = (startDay, hours) => {
    let from = moment(startDay, "DD-MM-YYYY hh:mm:ss");
    let diff = moment().diff(from);
    let elapsedDuration = moment.duration(diff);
    let percent = (elapsedDuration.asMinutes() / (60 * hours)) * 100;
    return Math.floor(parseInt(percent));
  };

  render() {
    return (
      <div style={this.state.style}>
        <span className="vheader" />
      </div>
    );
  }
}
