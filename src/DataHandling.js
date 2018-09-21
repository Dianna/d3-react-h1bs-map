import * as d3 from "d3";
import _ from "lodash";

const cleanIncomes = d => ({
  countyName: d["Name"],
  USstate: d["State"],
  medianIncome: Number(d["Median Household Income"]),
  lowerBound: Number(d["90% CI Lower Bound"]),
  upperBound: Number(d["90% CI Upper Bound"])
});

const dateParse = d3.timeParse("%m/%d/%Y");

const cleanSalary = d => {
  // Return null when a salary is undefined or absurdly high.
  if (!d["base salary"] || Number(d["base salary"]) > 300000) {
    return null;
  }

  return {
    employer: d.employer,
    submit_date: dateParse(d["submit date"]),
    start_date: dateParse(d["start date"]),
    case_status: d["case status"],
    job_title: d["job title"],
    clean_job_title: d["job title"],
    base_salary: Number(d["base salary"]),
    city: d["city"],
    USstate: d["state"],
    county: d["county"],
    countyID: d["countyID"]
  };
};

const cleanUSStateName = d => ({
  code: d.code,
  id: Number(d.id),
  name: d.name
});

// TODO: I CHANGED THIS
const cleanCountyNames = d => ({
  id: Number(d.id),
  name: d.name
});

/* ES6 trick: default argument values. If callback is false, we set it to `_.noop` - a function that does nothing. This lets us later call `callback()` without worrying whether it was given as an argument. */
export const loadAllData = (callback = _.noop) => {
  // `d3.queue` lets us call multiple asynchronous functions and wait for them all to finish
  d3.queue()
    // The tasks are D3's data loading functions that fire an Ajax request to the specified URL, parse the data into a JavaScript dictionary, and use the given row parsing function to polish the result
    .defer(d3.json, "data/us.json")
    // TODO: I CHANGED THIS
    .defer(d3.csv, "data/us-county-names-normalized.csv", cleanCountyNames)
    .defer(d3.csv, "data/county-median-incomes.csv", cleanIncomes)
    .defer(d3.csv, "data/h1bs-2012-2016-shortened.csv", cleanSalary)
    .defer(d3.tsv, "data/us-state-names.tsv", cleanUSStateName)
    // We define 5 tasks to run with `.defer` then wait for them to finish with `.await`
    .await(
      (error, us, countyNames, medianIncomes, techSalaries, USstateNames) => {
        let medianIncomesMap = {};

        /* Discard data from medianIncomes with county names not present in countyNames. Map median income data to that county's id */
        medianIncomes
          .filter(d => _.find(countyNames, { name: d["countyName"] }))
          .forEach(d => {
            d["countyID"] = _.find(countyNames, { name: d["countyName"] }).id;
            medianIncomesMap[d.countyID] = d;
          });

        // Remove empty tech salary data
        techSalaries = techSalaries.filter(d => !_.isNull(d));

        callback({
          usTopoJson: us,
          countyNames: countyNames,
          medianIncomes: medianIncomesMap,
          medianIncomesByCounty: _.groupBy(medianIncomes, "countyName"),
          medianIncomesByUSState: _.groupBy(medianIncomes, "USstate"),
          techSalaries: techSalaries,
          USstateNames: USstateNames
        });
      }
    );
};
