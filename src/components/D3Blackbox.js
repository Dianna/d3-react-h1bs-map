import React, { Component } from "react";
import PropTypes from "prop-types";

// Wrap D3 component in React (useful for axes)
export default function D3Blackbox(D3render) {
  return class Blackbox extends Component {
    static proptypes = {
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    };

    componentDidMount() {
      D3render.call(this);
    }

    componentDidUpdate() {
      D3render.call(this);
    }

    render() {
      const { x, y } = this.props;
      return <g transform={`translate(${x}, ${y})`} ref="anchor" />;
    }
  };
}
