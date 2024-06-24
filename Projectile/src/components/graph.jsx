import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function Graph(props){
  const options = {
    tension:0.4,
    scales: {
      x: {
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
  console.log(props.points);
  const lineChartData = {
    labels: props.points.x,
    datasets: [
      {
        label: props.label,
        data: props.points.y,
        borderColor: "rgb(75,192,192)",
      },
    ],
  };
  return (
    <>
      <Line options={options} data={lineChartData}/>
    </>
  )
}

export default Graph