import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const BarChart = ({
    series = apexData.barChart.series,
    categories = apexData.barChart.options.xaxis.categories,
    colors = ["#845adf", "#10b981"],
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
        ...apexData.barChart.options,
        ...options,
        colors: [primaryColor, '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#22c55e'],
        chart: {
            ...apexData.barChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
        },
        grid: {
            ...apexData.barChart.options.grid,
            borderColor: gridColor,
            ...(options.grid || {})
        },
        xaxis: {
            ...apexData.barChart.options.xaxis,
            categories: categories,
            labels: {
                ...(apexData.barChart.options.xaxis?.labels || {}),
                style: {
                    ...(apexData.barChart.options.xaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.xaxis || {})
        },
        yaxis: {
            ...apexData.barChart.options.yaxis,
            labels: {
                ...(apexData.barChart.options.yaxis?.labels || {}),
                style: {
                    ...(apexData.barChart.options.yaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.yaxis || {})
        },
        legend: {
            ...apexData.barChart.options.legend,
            ...(options.legend || {}),
            labels: {
                ...(apexData.barChart.options.legend?.labels || {}),
                ...(options.legend?.labels || {}),
                colors: options.legend?.labels?.colors || textColor
            },
            markers: {
                radius: 12,
                ...(options.legend?.markers || {})
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
            type="bar"
            height={height}
        />
    );
};

export default BarChart;
