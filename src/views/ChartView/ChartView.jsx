import React, { useState, useEffect } from 'react'
import { csv } from "csvtojson";
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'
import moment from 'moment'

const ChartView = () => {
 
  const [chartData, setChartData] = useState([])

  const options = { style: 'currency', currency: 'USD' };
  const numberFormat = new Intl.NumberFormat('en-US', options);

  const configPrice = {

    yAxis: [{
      offset: 20,

      labels: {
        formatter: function () {
          return numberFormat.format(this.value)
        }
        ,
        x: -15,
        style: {
          "color": "#000", "position": "absolute"

        },
        align: 'left'
      },
    },

    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return numberFormat.format(this.y, 0) + '</b><br/>' + moment(this.x).format('MMMM Do YYYY')
      }
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,

      }
    },
    rangeSelector: {
      selected: 1
    },
    title: {
      text: `AAPL`
    },
    chart: {
      height: 600,
    },

    credits: {
      enabled: false
    },

    legend: {
      enabled: true
    },
    xAxis: {
      type: 'date',
    },
    rangeSelector: {
      buttons: [
        // {
        //   type: 'day',
        //   count: 1,
        //   text: '1d',
        // },
        {
          type: 'day',
          count: 7,
          text: '7d'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 3,
          text: '3m'
        },
        {
          type: 'all',
          text: 'All'
        }],
      selected: 4
    },
    series: [{
      name: 'Price',
      type: 'spline',

      data: chartData,
      tooltip: {
        valueDecimals: 2
      },
    }
    ]
  };

  useEffect(async () => {
    const url = "./AAPL.csv";
    const res = await fetch(url);
    const text = await res.text();
    const jsonArray = await csv().fromString(text);   
    const _chartData = jsonArray.map(node => [new Date(node['Date']).getTime(), parseFloat(node['Close'])])
    setChartData(_chartData)
  }, []) 

  return (
    <div>
      <ReactHighcharts config={configPrice}></ReactHighcharts>
    </div>
  )
}

export default ChartView
