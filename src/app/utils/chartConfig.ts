// Chart.js Configuration and Helpers for enwayu
// Professional, clean charts to replace Recharts

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// enwayu Brand Colors
export const colors = {
  primary: '#00bc7d',
  primaryDark: '#009689',
  text: {
    primary: '#101828',
    secondary: '#4a5565',
    tertiary: '#6a7282',
  },
  chart: {
    green: '#00bc7d',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    orange: '#f97316',
    red: '#ef4444',
    yellow: '#eab308',
    cyan: '#06b6d4',
    emerald: '#10b981',
  },
  background: {
    green: 'rgba(0, 188, 125, 0.1)',
    blue: 'rgba(59, 130, 246, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
    orange: 'rgba(249, 115, 22, 0.1)',
  },
};

// Default Chart Options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          family: 'Inter',
          size: 12,
        },
        color: colors.text.secondary,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      font: {
        family: 'Inter',
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11,
        },
        color: colors.text.tertiary,
      },
      border: {
        color: '#e5e7eb',
      },
    },
    y: {
      grid: {
        color: '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11,
        },
        color: colors.text.tertiary,
        padding: 8,
      },
      border: {
        display: false,
      },
    },
  },
};

// Line Chart Config
export const lineChartOptions = {
  ...defaultChartOptions,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  elements: {
    line: {
      tension: 0.4, // Smooth curves
      borderWidth: 2,
    },
    point: {
      radius: 4,
      hoverRadius: 6,
      hitRadius: 30,
    },
  },
};

// Bar Chart Config
export const barChartOptions = {
  ...defaultChartOptions,
  barThickness: 'flex' as const,
  maxBarThickness: 40,
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false,
    },
  },
};

// Area Chart Config
export const areaChartOptions = {
  ...lineChartOptions,
  plugins: {
    ...lineChartOptions.plugins,
    filler: {
      propagate: true,
    },
  },
};

// Doughnut Chart Config
export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter',
          size: 12,
        },
        color: colors.text.secondary,
        generateLabels: (chart: any) => {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label: string, i: number) => {
              const value = data.datasets[0].data[i];
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i,
              };
            });
          }
          return [];
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};

// Helper function to create gradient
export const createGradient = (ctx: CanvasRenderingContext2D, color: string, opacity = 0.1) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color.replace(')', `, ${opacity * 2})`).replace('rgb', 'rgba'));
  gradient.addColorStop(1, color.replace(')', `, ${opacity})`).replace('rgb', 'rgba'));
  return gradient;
};

// Example Data Structures

export const exampleLineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Actual Emissions',
      data: [452, 438, 425, 410, 398, 385, 372, 358, 345, 332, 320, 308],
      borderColor: colors.chart.blue,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
    },
    {
      label: 'Target',
      data: [452, 445, 438, 431, 424, 417, 410, 403, 396, 389, 382, 375],
      borderColor: colors.chart.red,
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      fill: false,
    },
  ],
};

export const exampleBarChartData = {
  labels: ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR'],
  datasets: [
    {
      label: 'Emissions (kg CO₂e)',
      data: [125, 98, 76, 89, 45, 32],
      backgroundColor: colors.chart.green,
      borderRadius: 6,
    },
  ],
};

export const exampleDoughnutData = {
  labels: ['Carpool', 'Public Transit', 'Drive Solo', 'Bike/Walk', 'Work from Home'],
  datasets: [
    {
      data: [35, 28, 18, 12, 7],
      backgroundColor: [
        colors.chart.green,
        colors.chart.blue,
        colors.chart.orange,
        colors.chart.emerald,
        colors.chart.purple,
      ],
      borderWidth: 0,
    },
  ],
};
