import React, { Component } from "react";
import { render } from "react-dom";
import "bootstrap";
import $ from "jquery";

export default class Xslt extends Component {
  popperTab = [];

  componentDidMount() {
    this.InitPopperAndTooltip();
  }

  componentDidUpdate() {
    this.InitPopperAndTooltip();
  }

  componentWillUnmount = () => {
    this.popperTab = [];
    if (this.popper) {
      this.popper.off();
    }
  };

  InitPopperAndTooltip = () => {
    $('[data-toggle="tooltip"]').tooltip();
    this.popper = $('[data-toggle="popover"]')
      .popover({
        html: true
      })
      .on("shown.bs.popover", data => {
        this.popperTab.push($(data.target));
      });

    $(document).on("click touchend", e => {
      e.preventDefault();
      let target = $(e.target);
      this.popperTab.forEach(x => {
        if (!target.is(x)) {
          x.popover("hide");
          this.popperTab = this.popperTab.slice(this.popperTab.indexOf(x), 1);
        }
      });
    });
  };

  createMarkup = html => {
    return { __html: html };
  };

  render() {
    return <div dangerouslySetInnerHTML={this.createMarkup(this.props.fragment)} onClick={this.props.onClick} />;
  }
}
