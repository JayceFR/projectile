import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function Graph(props){
  var options = {
    scales: {
      x: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: props.xtext,
          font:{
            size: 24
          }
        }
      },
      y:{
        type: 'linear',
        beginAtZero: true,
        min: 0,
        title: {
          display: true,
          text: props.ytext,
          font:{
            size: 24
          }
        }
      }
    }
  }
  if (props.options){
    options = props.options;
  }
  const lineChartData = {
    datasets: props.dataset,
  };
  return (
    <>
      <Line options={options} data={lineChartData}/>
    </>
  )
}

export default Graph