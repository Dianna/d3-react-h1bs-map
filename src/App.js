import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";

import Preloader from "./components/Preloader";
import { loadAllData } from "./DataHandling";

class App extends Component {
  state = {
    techSalaries: [],
    countyNames: [],
    medianIncomes: []
  };

  componentWillMount() {
    /* Initiate data loading inside componentWillMount lifecycle hook. It fires right before React mounts the component into the DOM. It's good place to start loading data, but some say it's an anti-pattern.

    We'll tie it to component mount when using the basic architecture, and in a more render agnostic place when using Redux or MobX for state management.*/

    loadAllData(data => this.setState(data));
  }

  render() {
    if (this.state.techSalaries.length < 1) {
      return <Preloader />;
    }

    return (
      <div className="App container">
        <h1>Loaded {this.state.techSalaries.length}</h1>
      </div>
    );
  }
}

export default App;
