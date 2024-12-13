import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface Meal {
  deviceID: string;
  startTime: string;
  endTime: string;
  duration: string; // Duration as a string, expected to be convertible to a number
  totalKwh: number; // Total kWh
}

interface MealDurationChartProps {
  mealsWithDurations: Meal[];
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  }>;
}

const MealDurationChart: React.FC<MealDurationChartProps> = ({ mealsWithDurations }) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const aggregatedData: Record<string, { totalDuration: number; totalKwh: number }> = {};
    console.log("mealsWithDurations: ", mealsWithDurations);
    mealsWithDurations.forEach(meal => {
      const duration = parseFloat(meal.duration);
      const kwh = meal.totalKwh;

      if (aggregatedData[meal.deviceID]) {
        // If the deviceID already exists, accumulate the values
        aggregatedData[meal.deviceID].totalDuration += duration;
        aggregatedData[meal.deviceID].totalKwh += kwh;
      } else {
        // If not, initialize the entry
        aggregatedData[meal.deviceID] = {
          totalDuration: duration,
          totalKwh: kwh,
        };
      }
    });

    // Prepare data for the chart
    const labels = Object.keys(aggregatedData);
    const durations = labels.map(label => aggregatedData[label].totalDuration);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Meal Duration (minutes)',
          data: durations,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',//'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(34, 197, 94, 1)',//'rgba(75, 192, 192, 1)',
          borderWidth: 0.1,
          borderRadius: 0
        },
      ],
    });
  }, [mealsWithDurations]);

  return (
    <div className='bg-base-200 rounded-lg w-8/12'>
      <h2 className="text-lg text-orange-500 font-bold mb-4 text-center">Meal Durations</h2>
      <div style={{'height': '25vh'}}>  {/* Fixed height for the chart */}
        <Bar 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
                position: 'top',
              },
              title: {
                display: false,
                text: 'Meal Durations by Device',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Device ID',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Duration (minutes)',
                },
                beginAtZero: true, // Ensures y-axis starts at 0
              },
            },
          }} 
        />
      </div>
    </div>
  );
};

export default MealDurationChart;
