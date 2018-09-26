import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import ControlRow from "./ControlRow";

export default class Controls extends Component {
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
    updateDataFilter: PropTypes.func.isRequired
  };

  state = {
    yearFilter: () => true,
    jobTitleFilter: () => true,
    USstateFilter: () => true,
    year: "*",
    USstate: "*",
    jobTitle: "*"
  };

  // Prevent infinite looping when App updates from method calls here
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  }

  componentDidUpdate() {
    this.reportUpdateUpTheChain();
  }

  // Resets SOT for filter and year in App.js
  reportUpdateUpTheChain() {
    this.props.updateDataFilter(
      (filters => {
        return d =>
          filters.yearFilter(d) &&
          filters.jobTitleFilter(d) &&
          filters.USstateFilter(d);
      })(this.state),
      {
        year: this.state.year,
        jobTitle: this.state.jobTitle,
        USstate: this.state.USstate
      }
    );
  }

  // Partial filter called by ControlRow
  // year: user chooses a year
  // reset: when user "unselects" a toggle
  updateYearFilter(year, reset) {
    let filter = d => d.submit_date.getFullYear() === year;
    // Reimplement defaults
    if (reset || !year) {
      filter = () => true;
      year = "*";
    }

    this.setState(() => ({
      yearFilter: filter,
      year: year
    }));
  }

  updateJobTitleFilter(title, reset) {
    let filter = d => d.clean_job_title === title;
    // Reimplement defaults
    if (reset || !title) {
      filter = () => true;
      title = "*";
    }
    this.setState(() => ({
      jobTitleFilter: filter,
      jobTitle: title
    }));
  }

  updateUSstateFilter(USstate, reset) {
    let filter = d => d.USstate === USstate;
    // Reimplement defaults
    if (reset || !USstate) {
      filter = () => true;
      USstate = "*";
    }
    this.setState(() => ({
      USstateFilter: filter,
      USstate: USstate
    }));
  }

  render() {
    const data = this.props.data,
      years = new Set(data.map(d => d.submit_date.getFullYear())),
      jobTitles = new Set(data.map(d => d.clean_job_title)),
      USstates = new Set(data.map(d => d.USstate));

    return (
      <div>
        <ControlRow
          data={data}
          toggleNames={Array.from(years.values())}
          picked={this.state.year}
          updateDataFilter={this.updateYearFilter.bind(this)}
        />
        <ControlRow
          data={data}
          toggleNames={Array.from(jobTitles.values())}
          picked={this.state.jobTitle}
          updateDataFilter={this.updateJobTitleFilter.bind(this)}
        />
        <ControlRow
          data={data}
          toggleNames={Array.from(USstates.values())}
          picked={this.state.USstate}
          updateDataFilter={this.updateUSstateFilter.bind(this)}
          capitalize="true"
        />
      </div>
    );
  }
}
