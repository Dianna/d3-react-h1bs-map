import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import * as topojson from "topojson";
import _ from "lodash";

// We're using the "full-feature integration" strategy here
import County from "./County";

// We need three D3 objects to build a choropleth map: a geographical projection, a path generator, and a quantize scale for colors.
export default class CountyMap extends Component {
  static propTypes = {
    usTopoJson: PropTypes.shape({
      arcs: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
      ),
      objects: PropTypes.shape({
        counties: PropTypes.object,
        land: PropTypes.object,
        states: PropTypes.object
      }),
      transform: PropTypes.shape({
        scale: PropTypes.arrayOf(PropTypes.number),
        translate: PropTypes.arrayOf(PropTypes.number)
      }),
      type: PropTypes.string
    }).isRequired,
    USstateNames: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        id: PropTypes.number,
        name: PropTypes.string
      })
    ).isRequired,
    values: PropTypes.arrayOf(
      PropTypes.shape({
        countyID: PropTypes.number,
        value: PropTypes.number
      })
    ).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    zoom: PropTypes.string
  };

  constructor(props) {
    super(props);

    // Outlines of the scaled map to use
    this.projection = d3
      .geoAlbersUsa() // specificaly for US maps
      .scale(1280);
    // Generates the path to draw
    this.geoPath = d3.geoPath().projection(this.projection);
    // Scale data to choose color for county
    this.quantize = d3.scaleQuantize().range(d3.range(9));

    this.updateD3(props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.projection
      .translate([props.width / 2, props.height / 2]) // move to center
      .scale(props.width * 1.3); // This had to be discovered experimentally

    // Zoom to selected state
    if (props.zoom && props.usTopoJson) {
      const us = props.usTopoJson,
        statePaths = topojson.feature(us, us.objects.states).features,
        id = _.find(props.USstateNames, { code: props.zoom }).id;

      this.projection.scale(props.width * 4.5); //zoom effect

      // Calculate center point of selected state
      const centroid = this.geoPath.centroid(_.find(statePaths, { id: id })),
        translate = this.projection.translate();

      // Align to selected state center
      this.projection.translate([
        translate[0] - centroid[0] + props.width / 2,
        translate[1] - centroid[1] + props.height / 2
      ]);
    }

    if (props.values) {
      // Need new color range. Values discovered experimentally to bring higher contrast to the richer middle of range.
      this.quantize.domain([
        d3.quantile(props.values, 0.15, d => d.value),
        d3.quantile(props.values, 0.85, d => d.value)
      ]);
    }
  }

  render() {
    if (!this.props.usTopoJson) {
      return null;
    } else {
      const us = this.props.usTopoJson, // map data
        statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b), // borders: line around states
        counties = topojson.feature(us, us.objects.counties).features; // flat areas: values for counties

      const countyValueMap = _.fromPairs(
        this.props.values.map(d => [d.countyID, d.value])
      );

      return (
        <g transform={`translate(${this.props.x}, ${this.props.y})`}>
          {counties.map(feature => (
            <County
              geoPath={this.geoPath}
              feature={feature}
              zoom={this.props.zoom}
              key={feature.id}
              quantize={this.quantize}
              value={countyValueMap[feature.id]}
            />
          ))}

          <path
            d={this.geoPath(statesMesh)}
            style={{
              fill: "none",
              stroke: "#fff",
              strokeLinejoin: "round"
            }}
          />
        </g>
      );
    }
  }
}
