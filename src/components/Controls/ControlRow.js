import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Toggle from "./Toggle";

export default class ControlRow extends Component {
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
    toggleNames: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ).isRequired,
    picked: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    updateDataFilter: PropTypes.func.isRequired
  };

  // Sets toggleValues to state.
  // Keys: toggle names, Values: boolean (toggle picked)
  componentWillMount() {
    let toggles = this.props.toggleNames,
      toggleValues = _.zipObject(
        toggles,
        toggles.map(name => name === this.props.picked)
      );

    this.setState(() => ({ toggleValues: toggleValues }));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.picked !== nextProps.picked && nextProps.picked !== "*") {
      this.makePick(nextProps.picked, true);
    }
  }

  // Callback used by Toggle
  makePick(picked, newState) {
    let toggleValues = this.state.toggleValues;
    // Re-map selected toggles (complete remap so React sees change, necessary?)
    toggleValues = _.mapValues(toggleValues, (value, key) => {
      return newState && key === picked.toString();
    });

    // if newState is false, we want to reset (2nd param upstream) (user "unselected" toggle)
    this.props.updateDataFilter(picked, !newState);

    this.setState(() => ({ toggleValues: toggleValues }));
  }

  // Render helper method
  _addToggle(name) {
    let key = `toggle-${name}`,
      label = name;

    if (this.props.capitalize) {
      label = label.toUpperCase();
    }

    return (
      <Toggle
        label={label}
        name={name}
        key={key}
        value={this.state.toggleValues[name]}
        onClick={this.makePick.bind(this)}
      />
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          {this.props.toggleNames.map(name => this._addToggle(name))}
        </div>
      </div>
    );
  }
}
