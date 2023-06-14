import React from 'react'
import Chart from "react-apexcharts";

const ChartTemp = ({raw}) => {

const array_id = raw.map(doc => doc.id);
const timestamp = array_id.map((data) => {
 const date = new Date(parseInt(data));
  return date.toLocaleDateString(); // convert the date unix to timestamp string (yy/mm/dd)
})

//Chart of line
const options = {
  chart: {
  height: 350,
  type: 'line',
  zoom: {
    enabled: false
  },
},
dataLabels: {
  enabled: false
},
stroke: {
  curve: 'straight'
},
title: {
  text: 'Product Trends by Month',
  align: 'left'
},
grid: {
  row: {
    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
    opacity: 0.5
  },
},
xaxis: {
  categories: timestamp,
},
stroke: {
  curve: 'smooth'
},
 }

 const series = [
  {
  name: "Temp -  °C",
  data: raw.map(data => data.temp) //We get the array data temp
 }]


  return (
    <div>
    <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={options}
              series={series}
              type="area"
              width="90%"
              height="500"
            />
          </div>
        </div>
      </div>
   </div>
  )

}


/*----------------------------------------------------------------
Temp --> chartLine
Cond --> chartDonnu
ph --> charColum
crec --> chartRadialGradient 
*/
export default ChartTemp



