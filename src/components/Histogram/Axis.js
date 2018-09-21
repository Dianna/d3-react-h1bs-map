import * as d3 from "d3";
import D3Blackbox from "../D3Blackbox";

const Axis = D3Blackbox(function() {
  const axis = d3
    .axisLeft()
    .tickFormat(d => `${d3.format(".2s")(d)}`)
    .scale(this.props.scale)
    .ticks(this.props.data.length);

  d3.select(this.refs.anchor).call(axis);
});

export default Axis;
