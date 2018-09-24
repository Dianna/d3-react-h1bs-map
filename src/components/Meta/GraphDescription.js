import React, { Component } from "react";
import PropTypes from "prop-types";

export default class GraphDescription extends Component {
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
      year: PropTypes.string,
      jobTitle: PropTypes.string
    }).isRequired
  };

  get jobTitleFragment() {
    const jobTitle = this.props.filteredBy.jobTitle;
    let title;

    if (jobTitle === "*" || jobTitle === "other") {
      title = "in tech";
    } else {
      title = `a software ${jobTitle}`;
    }
    return title;
  }

  render() {
    return (
      <div>
        <div className="col-md-6 text-center">
          <h3>Best places to be {this.jobTitleFragment}</h3>
          <small>
            Darker color means bigger difference between median household salary
            <br />
            and individual tech salary. Gray means lack of tech salary data.
          </small>
        </div>
        <div className="col-md-6 text-center">
          <h3>Salary distribution</h3>
          <small>
            Histogram shows tech salary distribution compared to median
            household income, which is a good proxy for cost of living.
          </small>
        </div>
      </div>
    );
  }
}
