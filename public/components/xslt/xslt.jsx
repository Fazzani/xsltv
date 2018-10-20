import React, { Component } from 'react'
import 'bootstrap'
import $ from 'jquery'
import PropTypes from 'prop-types'

export default class Xslt extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    fragment: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.popperTab = []
  }

  componentDidMount() {
    this.InitPopperAndTooltip()
  }

  componentDidUpdate() {
    this.InitPopperAndTooltip()
  }

  componentWillUnmount = () => {
    this.popperTab = []
    if (this.popper) {
      this.popper.off()
    }
  }

  InitPopperAndTooltip = () => {
    $('[data-toggle="tooltip"]').tooltip()
    this.popper = $('[data-toggle="popover"]')
      .popover({
        html: true,
      })
      .on('shown.bs.popover', (data) => {
        this.popperTab.push($(data.target))
      })

    $(document).on('click touchend', (e) => {
      let target = $(e.target)
      for (const popper of this.popperTab) {
        if (!target.is(popper)) {
          popper.popover('hide')
          this.popperTab = this.popperTab.slice(
            this.popperTab.indexOf(popper),
            1
          )
        }
      }
    })
  }

  createMarkup = (html) => {
    return { __html: html }
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={this.createMarkup(this.props.fragment)}
        onClick={this.props.onClick}
      />
    )
  }
}
