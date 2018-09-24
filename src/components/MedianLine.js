import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

export default class MedianLine extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        USstate: PropTypes.string,
        base_salary: PropTypes.number,
        case_status: PropTypes.string,
        city: PropTypes.string,
        clean_job_title: PropTypes.string,
        county: PropTypes.string,
        countyID: PropTypes.string,
        employer: PropTypes.string,
        job_title: PropTypes.string,
        start_date: PropTypes.object,
        submit_date: PropTypes.object
      })
    ).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    bottomMargin: PropTypes.number.isRequired,
    median: PropTypes.number.isRequired,
    value: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.yScale = d3.scaleLinear();

    this.updateD3(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.yScale
      .domain([0, d3.max(props.data, props.value)])
      .range([0, props.height - props.y - props.bottomMargin]);
  }

  render() {
    const median =
        this.props.median || d3.median(this.props.data, this.props.value),
      line = d3.line()([[0, 5], [this.props.width, 5]]),
      tickFormat = this.yScale.tickFormat();

    const translate = `translate(${this.props.x}, ${this.yScale(median)})`,
      medianLabel = `Median Household: ${tickFormat(median)}`;

    return (
      <g className="mean" transform={translate}>
        <text x={this.props.width - 5} y={0} textAnchor="end">
          {medianLabel}
        </text>
        <path d={line} />
      </g>
    );
  }
}
