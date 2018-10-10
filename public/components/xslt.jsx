import React, { Component } from "react";
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

    // $(DOCUMENT).ON("CLICK TOUCHEND", E => {
    //   E.PREVENTDEFAULT();
    //   LET TARGET = $(E.TARGET);
    //   THIS.POPPERTAB.FOREACH(X => {
    //     IF (!TARGET.IS(X)) {
    //       X.POPOVER("HIDE");
    //       THIS.POPPERTAB = THIS.POPPERTAB.SLICE(THIS.POPPERTAB.INDEXOF(X), 1);
    //     }
    //   });
    // });
  };

  createMarkup = html => {
    return { __html: html };
  };

  render() {
    return <div dangerouslySetInnerHTML={this.createMarkup(this.props.fragment)} onClick={this.props.onClick} />;
  }
}
