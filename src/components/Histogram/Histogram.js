import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import HistogramBar from "./HistogramBar";
import Axis from "./Axis";

// We're using the "full-feature integration" strategy here
export default class Histogram extends Component {
  static propTypes = {
    bins: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
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
    axisMargin: PropTypes.number.isRequired,
    bottomMargin: PropTypes.number.isRequired,
    value: PropTypes.func.isRequired
  };

  constructor(props) {
    super();
    // `.histogram()` takes a dataset and returns a histogram-shaped dataset: An array of arrays. Top level are bins and meta data. Children are "values in this bin"
    this.histogram = d3.histogram();
    this.widthScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    this.updateD3(props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    // Thresholds: which bar to assign data (base_salary) to
    this.histogram.thresholds(props.bins).value(props.value);

    // Assign data to bars
    const bars = this.histogram(props.data),
      counts = bars.map(d => d.length);

    // Calculate min / max bar length
    this.widthScale
      .domain([d3.min(counts), d3.max(counts)])
      .range([0, props.width - props.axisMargin]);

    // Calculate bar height
    this.yScale
      .domain([0, d3.max(bars, d => d.x1)])
      .range([0, props.height - props.y - props.bottomMargin]);
  }

  makeBar(bar) {
    let percent = (bar.length / this.props.data.length) * 100;

    let props = {
      percent: percent,
      x: this.props.axisMargin,
      y: this.yScale(bar.x0),
      width: this.widthScale(bar.length),
      height: this.yScale(bar.x1 - bar.x0),
      key: "histogram-bar-" + bar.x0 // So React can track & rerender appropriately
    };

    return <HistogramBar {...props} />;
  }

  render() {
    const translate = `translate(${this.props.x}, ${this.props.y})`,
      bars = this.histogram(this.props.data);

    return (
      <g className="histogram" transform={translate}>
        <g className="bars">{bars.map(this.makeBar.bind(this))}</g>
        <Axis
          x={this.props.axisMargin - 3}
          y={0}
          data={bars}
          scale={this.yScale}
        />
      </g>
    );
  }
}
