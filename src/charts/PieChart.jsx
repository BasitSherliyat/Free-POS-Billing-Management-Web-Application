import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const PieChart = ({
    series = apexData.pieChart.series,
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
        ...apexData.pieChart.options,
        ...options,
        colors: [primaryColor, '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        chart: {
            ...apexData.pieChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
        },
        legend: {
            ...apexData.pieChart.options.legend,
            labels: {
                ...(apexData.pieChart.options.legend?.labels || {}),
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
            type="pie"
            height={height}
        />
    );
};

export default PieChart;
