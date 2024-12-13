import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = {
  data: number[];
  labels: string[];
  title?: string;
  units: string;
};

const generateBackgroundColors = (count: number): string[] => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 90%, 50%)`);
  }
  return colors;
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, labels, title, units }) => {
  const backgroundColors = generateBackgroundColors(data.length);
  const total = data.reduce((acc, value) => acc + value, 0).toFixed(2);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: data.length <= 8,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: true,
        cornerRadius: 10,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = parseFloat(context.raw.toFixed(2)) || 0;
            return `${label}: ${value} ${units}`;
          },
        },
      },
      // Central text display logic added directly to plugins
      beforeDraw: (chart: any) => {
        const { ctx, chartArea: { width, height } } = chart;
        ctx.save();
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate the center of the doughnut
        const centerX = width / 2;
        const centerY = height / 2;

        // Split the text lines
        const lines = [`Total`, `${total} ${units}`];

        // Render each line, adjusting Y position for multiple lines
        lines.forEach((line, index) => {
          ctx.fillText(line, centerX, centerY + (index * 20) - (lines.length - 1) * 10);
        });

        ctx.restore();
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default DoughnutChart;
