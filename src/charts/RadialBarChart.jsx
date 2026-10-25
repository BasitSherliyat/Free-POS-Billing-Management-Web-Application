import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const RadialBarChart = ({
    series = apexData.radialChart.series,
    options = {},
    height = 280
}) => {
    const { theme, primaryColor: themePrimaryColor } = useTheme();
    const primaryColor = `rgb(${themePrimaryColor.split(' ').join(',')})`;
    const actualTheme = theme === 'system'
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
        : theme;

    const isDarkMode = actualTheme === 'dark';
    const textColor = isDarkMode ? '#e5e7eb' : '#374151';

    const chartOptions = {
        ...apexData.radialChart.options,
        ...options,
        colors: [primaryColor],
        chart: {
            ...apexData.radialChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
        },
        plotOptions: {
            ...apexData.radialChart.options.plotOptions,
            radialBar: {
                ...(apexData.radialChart.options.plotOptions?.radialBar || {}),
                hollow: {
                    ...(apexData.radialChart.options.plotOptions?.radialBar?.hollow || {}),
                    margin: 15,
                    size: '70%',
                },
                dataLabels: {
                    ...(apexData.radialChart.options.plotOptions?.radialBar?.dataLabels || {}),
                    name: {
                        ...(apexData.radialChart.options.plotOptions?.radialBar?.dataLabels?.name || {}),
                        show: true,
                        color: textColor,
                    },
                    value: {
                        ...(apexData.radialChart.options.plotOptions?.radialBar?.dataLabels?.value || {}),
                        show: true,
                        color: isDarkMode ? '#fff' : '#111827',
                    }
                }
            },
            ...(options.plotOptions || {})
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
            type="radialBar"
            height={height}
        />
    );
};

export default RadialBarChart;
