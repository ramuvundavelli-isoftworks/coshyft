// Example: Chart.js Integration
// Shows how to use new Chart.js charts instead of Recharts

import React, { useRef, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  lineChartOptions,
  barChartOptions,
  doughnutChartOptions,
  colors,
  exampleLineChartData,
  exampleBarChartData,
  exampleDoughnutData,
} from '../utils/chartConfig';

export default function ChartJSExample() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#101828]">Chart.js Examples</h1>
        <p className="text-[#4a5565] mt-1">
          Modern, clean charts for enwayu dashboards
        </p>
      </div>

      {/* Line Chart - Emissions Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#101828] mb-4">
          Emissions Trend - Line Chart
        </h3>
        <div style={{ height: '300px' }}>
          <Line data={exampleLineChartData} options={lineChartOptions} />
        </div>
      </Card>

      {/* Bar Chart - Department Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#101828] mb-4">
          Department Emissions - Bar Chart
        </h3>
        <div style={{ height: '300px' }}>
          <Bar data={exampleBarChartData} options={barChartOptions} />
        </div>
      </Card>

      {/* Doughnut Chart - Mode Split */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#101828] mb-4">
          Transport Mode Split - Doughnut Chart
        </h3>
        <div style={{ height: '350px' }}>
          <Doughnut data={exampleDoughnutData} options={doughnutChartOptions} />
        </div>
      </Card>

      {/* Area Chart Example */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#101828] mb-4">
          Area Chart with Gradient Fill
        </h3>
        <div style={{ height: '300px' }}>
          <Line 
            data={{
              ...exampleLineChartData,
              datasets: [
                {
                  ...exampleLineChartData.datasets[0],
                  fill: true,
                  backgroundColor: 'rgba(0, 188, 125, 0.1)',
                  borderColor: colors.chart.green,
                },
              ],
            }} 
            options={lineChartOptions} 
          />
        </div>
      </Card>

      {/* Multiple Datasets Example */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#101828] mb-4">
          Multi-Dataset Comparison
        </h3>
        <div style={{ height: '300px' }}>
          <Bar 
            data={{
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              datasets: [
                {
                  label: '2025 Actual',
                  data: [125, 118, 105, 98],
                  backgroundColor: colors.chart.green,
                  borderRadius: 6,
                },
                {
                  label: '2024 Actual',
                  data: [142, 138, 135, 130],
                  backgroundColor: colors.chart.blue,
                  borderRadius: 6,
                },
                {
                  label: '2026 Target',
                  data: [115, 110, 105, 100],
                  backgroundColor: colors.chart.orange,
                  borderRadius: 6,
                },
              ],
            }} 
            options={barChartOptions} 
          />
        </div>
      </Card>

      {/* Custom Styled Chart */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <h3 className="text-lg font-semibold text-[#101828] mb-4">
          Custom Styled Chart Example
        </h3>
        <div style={{ height: '300px' }}>
          <Line 
            data={{
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [
                {
                  label: 'Carpool Trips',
                  data: [12, 15, 18, 22],
                  borderColor: colors.chart.purple,
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: colors.chart.purple,
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                },
              ],
            }} 
            options={{
              ...lineChartOptions,
              plugins: {
                ...lineChartOptions.plugins,
                legend: {
                  ...lineChartOptions.plugins.legend,
                  display: false,
                },
              },
            }} 
          />
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          How to Use Chart.js in Your Pages
        </h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="p-3 bg-white rounded-lg">
            <p className="font-semibold mb-2">1. Import the chart type:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`import { Line, Bar, Doughnut } from 'react-chartjs-2';`}
            </code>
          </div>

          <div className="p-3 bg-white rounded-lg">
            <p className="font-semibold mb-2">2. Import chart config:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block">
              {`import { lineChartOptions, colors } from '../utils/chartConfig';`}
            </code>
          </div>

          <div className="p-3 bg-white rounded-lg">
            <p className="font-semibold mb-2">3. Use in your component:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block whitespace-pre">
{`<div style={{ height: '300px' }}>
  <Line data={yourData} options={lineChartOptions} />
</div>`}
            </code>
          </div>

          <div className="p-3 bg-white rounded-lg">
            <p className="font-semibold mb-2">4. Data structure:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block whitespace-pre">
{`const data = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Emissions',
    data: [100, 95, 90],
    borderColor: colors.chart.green,
    backgroundColor: 'rgba(0, 188, 125, 0.1)',
  }]
};`}
            </code>
          </div>
        </div>
      </Card>

      {/* Benefits */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#101828] mb-3">
          Why Chart.js?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">✓ Better Performance</p>
            <p className="text-sm text-green-700">
              Faster rendering and smoother animations
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">✓ Cleaner Design</p>
            <p className="text-sm text-green-700">
              More professional, modern appearance
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">✓ Better Tooltips</p>
            <p className="text-sm text-green-700">
              More informative, better styled
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">✓ More Flexible</p>
            <p className="text-sm text-green-700">
              Easier to customize and extend
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
