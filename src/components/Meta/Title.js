import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { mean as d3mean, extent as d3extent } from "d3-array";

import USStatesMap from "./USStatesMap";

export default class Title extends Component {
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
    filteredBy: PropTypes.shape({
      USstate: PropTypes.string,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      jobTitle: PropTypes.string
    }).isRequired
  };

  get yearsFragment() {
    const year = this.props.filteredBy.year;

    return year === "*" ? "" : ` in ${year}`;
  }

  get USstateFragment() {
    const USstate = this.props.filteredBy.USstate;

    return USstate === "*" ? "" : USStatesMap[USstate.toUpperCase()];
  }

  get jobTitleFragment() {
    const { jobTitle, year } = this.props.filteredBy;
    let title = "";

    if (jobTitle === "*") {
      if (year === "*") {
        title = "The average H1B in tech pays";
      } else {
        title = "The average tech H1B paid";
      }
    } else {
      if (jobTitle === "*") {
        title = "H1Bs in tech pay";
      } else {
        title = `Software ${jobTitle}s on an H1B`;

        if (year === "*") {
          title += " make";
        } else {
          title += " made";
        }
      }
    }

    return title;
  }

  // Returns function that formats the dollar amount with ','s as necessary
  get format() {
    return scaleLinear()
      .domain(d3extent(this.props.data, d => d.base_salary))
      .tickFormat();
  }

  render() {
    const mean = this.format(d3mean(this.props.data, d => d.base_salary));

    let title;

    if (this.yearsFragment && this.USstateFragment) {
      title = (
        <h2>
          In {this.USstateFragment}, {this.jobTitleFragment}${mean}
          /year {this.yearsFragment}
        </h2>
      );
    } else {
      title = (
        <h2>
          {this.jobTitleFragment} ${mean}
          /year
          {this.USstateFragment ? `in ${this.stateFragment}` : ""}
          {this.yearsFragment}
        </h2>
      );
    }

    return title;
  }
}
