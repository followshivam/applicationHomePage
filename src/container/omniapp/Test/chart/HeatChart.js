import React, { Component } from "react";
import Chart from "react-apexcharts";
import {HeatChartData} from './chart';


class HeatChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {},
      series: [],
      labels: [],
    };
  }

  render() {
    return (
      <div className="HeatChart">
        <Chart
          options={HeatChartData.options}
          series={HeatChartData.series}
          type="heatmap"
          height={window.innerHeight-25}
        />
      </div>
    );
  }
}

export default HeatChart;
