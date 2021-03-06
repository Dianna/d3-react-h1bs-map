import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

const ChoroplethColors = _.reverse([
  "rgb(247,251,255)",
  "rgb(222,235,247)",
  "rgb(198,219,239)",
  "rgb(158,202,225)",
  "rgb(107,174,214)",
  "rgb(66,146,198)",
  "rgb(33,113,181)",
  "rgb(8,81,156)",
  "rgb(8,48,107)"
]);

const BlankColor = "rgb(240,240,240)"; // a pleasant gray ;)

// We're using the "full-feature integration" strategy here
export default class County extends Component {
  static propTypes = {
    geoPath: PropTypes.func.isRequired,
    feature: PropTypes.shape({
      geometry: PropTypes.object,
      id: PropTypes.number,
      properties: PropTypes.object,
      type: PropTypes.string
    }).isRequired,
    zoom: PropTypes.string,
    quantize: PropTypes.func.isRequired,
    value: PropTypes.number
  };

  /* CountyMap passes complex props - quantize, geoPath, and feature - which are pass-by-reference instead of pass-by-value. That means React can't see when they produce different values, just when they are different instances.

  This can lead to all 3,220 counties re-rendering every time a user does anything. But they only have to re-render if we change the map zoom or if the county gets a new value. */
  shouldComponentUpdate(nextProps, nextState) {
    const { zoom, value } = this.props;

    return zoom !== nextProps.zoom || value !== nextProps.value;
  }

  render() {
    const { value, geoPath, feature, quantize } = this.props;
    let color = BlankColor;

    if (value) {
      color = ChoroplethColors[quantize(value)];
    }

    return (
      <path d={geoPath(feature)} style={{ fill: color }} title={feature.id} />
    );
  }
}
