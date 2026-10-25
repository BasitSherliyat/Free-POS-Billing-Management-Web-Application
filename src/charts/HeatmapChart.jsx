import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const HeatmapChart = ({
    series = apexData.heatmapChart.series,
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

    const chartOptions = {
        ...apexData.heatmapChart.options,
        ...options,
        colors: [primaryColor],
        chart: {
            ...apexData.heatmapChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
        },
        xaxis: {
            ...apexData.heatmapChart.options.xaxis,
            labels: {
                ...(apexData.heatmapChart.options.xaxis?.labels || {}),
                style: {
                    ...(apexData.heatmapChart.options.xaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.xaxis || {})
        },
        yaxis: {
            ...apexData.heatmapChart.options.yaxis,
            labels: {
                ...(apexData.heatmapChart.options.yaxis?.labels || {}),
                style: {
                    ...(apexData.heatmapChart.options.yaxis?.labels?.style || {}),
                    colors: textColor
                }
            },
            ...(options.yaxis || {})
        },
        legend: {
            ...apexData.heatmapChart.options.legend,
            labels: {
                ...(apexData.heatmapChart.options.legend?.labels || {}),
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
            type="heatmap"
            height={height}
        />
    );
};

export default HeatmapChart;
