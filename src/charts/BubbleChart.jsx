import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const BubbleChart = ({
    series = apexData.bubbleChart.series,
    options = {},
    height = 350
}) => {
    const { theme, primaryColor: themePrimaryColor } = useTheme();
    const primaryColor = `rgb(${themePrimaryColor.split(' ').join(',')})`;
    const actualTheme = theme === 'system'
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
        : theme;

    const isDarkMode = actualTheme === 'dark';
    const textColor = isDarkMode ? '#e5e7eb' : '#374151';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const chartOptions = {
        ...apexData.bubbleChart.options,
        ...options,
        colors: [primaryColor, '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#22c55e'],
        chart: {
            ...apexData.bubbleChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
        },
        grid: {
            ...apexData.bubbleChart.options.grid,
            borderColor: gridColor,
            ...(options.grid || {})
        },
        xaxis: {
            ...apexData.bubbleChart.options.xaxis,
            labels: {
                ...(apexData.bubbleChart.options.xaxis?.labels || {}),
                style: {
                    ...(apexData.bubbleChart.options.xaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.xaxis || {})
        },
        yaxis: {
            ...apexData.bubbleChart.options.yaxis,
            labels: {
                ...(apexData.bubbleChart.options.yaxis?.labels || {}),
                style: {
                    ...(apexData.bubbleChart.options.yaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.yaxis || {})
        },
        legend: {
            ...apexData.bubbleChart.options.legend,
            labels: {
                ...(apexData.bubbleChart.options.legend?.labels || {}),
                colors: textColor
            },
            markers: {
                radius: 12
            }
        },
        theme: {
            mode: actualTheme
        },
        tooltip: {
            theme: actualTheme
        }
    };

    return (
        <Chart
            options={chartOptions}
            series={series}
            type="bubble"
            height={height}
        />
    );
};

export default BubbleChart;
