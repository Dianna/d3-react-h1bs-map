import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";

import "./App.css";
import { loadAllData } from "./DataHandling";
import Preloader from "./components/Preloader";
import CountyMap from "./components/CountyMap";
import Histogram from "./components/Histogram";
import Controls from "./components/Controls";
import { Title, Description, GraphDescription } from "./components/Meta";
import MedianLine from "./components/MedianLine";

class App extends Component {
  state = {
    techSalaries: [],
    countyNames: [],
    medianIncomes: [],
    salariesFilter: () => true,
    filteredBy: {
      USstate: "*",
      year: "*",
      jobTitle: "*"
    }
  };

  componentWillMount() {
    /* Initiate data loading inside componentWillMount lifecycle hook. It fires right before React mounts the component into the DOM. It's good place to start loading data, but some say it's an anti-pattern.

    We'll tie it to component mount when using the basic architecture, and in a more render agnostic place when using Redux or MobX for state management.*/

    loadAllData(data => this.setState(() => ({ ...data })));
  }

  countyValue(county, techSalariesMap) {
    const medianHousehold = this.state.medianIncomes[county.id],
      salaries = techSalariesMap[county.name];

    if (!medianHousehold || !salaries) {
      return null;
    }

    const median = d3.median(salaries, d => d.base_salary);

    return {
      countyID: county.id,
      value: median - medianHousehold.medianIncome
    };
  }

  // Will be called by Controls downstream
  updateDataFilter(salariesFilter, filteredBy) {
    this.setState(() => ({
      salariesFilter,
      filteredBy
    }));
  }

  render() {
    if (this.state.techSalaries.length < 1) {
      return <Preloader />;
    }

    // Returns: only counties that have data, grouped by county
    const filteredSalaries = this.state.techSalaries.filter(
        this.state.salariesFilter // state default returns all salaries
      ),
      filteredSalariesMap = _.groupBy(filteredSalaries, "countyID"),
      countyValues = this.state.countyNames
        .map(county => this.countyValue(county, filteredSalariesMap))
        .filter(d => !_.isNull(d));

    let zoom = null,
      medianHousehold = this.state.medianIncomesByUSState["US"][0].medianIncome;

    if (this.state.filteredBy.USstate !== "*") {
      zoom = this.state.filteredBy.USstate;

      medianHousehold = d3.mean(
        this.state.medianIncomesByUSState[zoom],
        d => d.medianIncome
      );
    }

    return (
      <div className="App container">
        <Title data={filteredSalaries} filteredBy={this.state.filteredBy} />

        <Description
          data={filteredSalaries}
          allData={this.state.techSalaries}
          medianIncomesByCounty={this.state.medianIncomesByCounty}
          filteredBy={this.state.filteredBy}
        />

        <GraphDescription
          data={filteredSalaries}
          filteredBy={this.state.filteredBy}
        />

        <svg width="1100" height="500">
          <CountyMap
            usTopoJson={this.state.usTopoJson}
            USstateNames={this.state.USstateNames}
            values={countyValues}
            x={0}
            y={0}
            width={500}
            height={500}
            zoom={zoom}
          />

          <rect
            x="500"
            y="0"
            width="600"
            height="500"
            style={{ fill: "white" }}
          />

          <Histogram
            bins={10}
            width={500}
            height={500}
            x="500"
            y="10"
            data={filteredSalaries}
            axisMargin={83}
            bottomMargin={5}
            value={d => d.base_salary}
          />

          <MedianLine
            data={filteredSalaries}
            x={500}
            y={10}
            width={600}
            height={500}
            bottomMargin={5}
            median={medianHousehold}
            value={d => d.base_salary}
          />
        </svg>

        <Controls
          data={this.state.techSalaries}
          updateDataFilter={this.updateDataFilter.bind(this)}
        />
      </div>
    );
  }
}

export default App;
