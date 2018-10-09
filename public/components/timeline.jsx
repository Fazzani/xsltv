import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "../styles/timeline.css";
import $ from "jquery";

export default class Timeline extends Component {
  static propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    hours: PropTypes.number.isRequired,
    parentNode: PropTypes.any.isRequired,
    timeout: PropTypes.number
  };
  static defaultProps = {
    hours: 4,
    startDate: new Date(),
    timeout: 1000
  };

  constructor(props) {
    super(props);
    this.vline = React.createRef();
    this.state = {
      style: { marginLeft: 0 }
    };
  }

  componentDidMount() {
    //if (this.props.parentNode != undefined) console.log(`parentNode.clientWidth: ${this.props.parentNode.clientWidth}`);
    let leftchannel = $(this.props.parentNode).find(".leftchannel:first");
    let paddingLeft = ((leftchannel ? leftchannel.width() : 0) / this.props.parentNode.clientWidth) * 100;
    this.interval = setInterval(() => {
      let marginLeft = this.percentElapsedTimeNowByDay(this.props.startDate, this.props.hours) + paddingLeft + "%";
      //console.log("MarginLeft => ", marginLeft);
      this.setState({
        style: { marginLeft: marginLeft }
      });
    }, this.props.timeout);
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
      <div className="vline" style={this.state.style}>
        <span className="vheader" />
      </div>
    );
  }
}
