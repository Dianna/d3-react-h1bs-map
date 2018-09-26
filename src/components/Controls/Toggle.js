import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Toggle extends Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    value: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  };

  handleClick() {
    this.props.onClick(this.props.name, !this.props.value);
  }

  render() {
    let className = "btn btn-default";

    if (this.props.value) {
      className += " btn-primary";
    }

    return (
      <button className={className} onClick={this.handleClick.bind(this)}>
        {this.props.label}
      </button>
    );
  }
}
