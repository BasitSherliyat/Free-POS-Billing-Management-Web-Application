import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const MixedChart = ({
    series = apexData.mixedChart.series,
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
        ...apexData.mixedChart.options,
        ...options,
        colors: [primaryColor, '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#22c55e'],
        chart: {
            ...apexData.mixedChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
        },
        grid: {
            ...apexData.mixedChart.options.grid,
            borderColor: gridColor,
            ...(options.grid || {})
        },
        xaxis: {
            ...apexData.mixedChart.options.xaxis,
            labels: {
                ...(apexData.mixedChart.options.xaxis?.labels || {}),
                style: {
                    ...(apexData.mixedChart.options.xaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.xaxis || {})
        },
        yaxis: {
            ...apexData.mixedChart.options.yaxis,
            labels: {
                ...(apexData.mixedChart.options.yaxis?.labels || {}),
                style: {
                    ...(apexData.mixedChart.options.yaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.yaxis || {})
        },
        legend: {
            ...apexData.mixedChart.options.legend,
            labels: {
                ...(apexData.mixedChart.options.legend?.labels || {}),
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
            type="line"
            height={height}
        />
    );
};

export default MixedChart;
