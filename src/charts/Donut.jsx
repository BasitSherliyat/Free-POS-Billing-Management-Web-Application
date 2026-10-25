import React from 'react';
import Chart from 'react-apexcharts';
import apexData from '../assets/data/apex-charts-data.json';
import { useTheme } from '../context/ThemeContext';

const Donut = ({
    series = apexData.donutChart.series,
    labels = apexData.donutChart.options.labels,
    colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545'],
    height = 350,
    showLabels = true,
    showLegend = true,
    showTotal = false,
    totalLabel = 'Total',
    totalFormatter = (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
    options = {}
}) => {
    const { theme, primaryColor: themePrimaryColor } = useTheme();
    const primaryColor = `rgb(${themePrimaryColor.split(' ').join(',')})`;
    const actualTheme = theme === 'system'
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
        : theme;

    const isDarkMode = actualTheme === 'dark';
    const textColor = isDarkMode ? '#e5e7eb' : '#374151';

    const chartOptions = {
        ...apexData.donutChart.options,
        ...options,
        labels: options.labels || labels,
        colors: [primaryColor, '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        dataLabels: {
            enabled: showLabels,
            ...(options.dataLabels || {})
        },
        legend: {
            show: showLegend,
            position: 'bottom',
            labels: {
                ...(apexData.donutChart.options.legend?.labels || {}),
                colors: textColor
            },
            markers: {
                radius: 12
            },
            ...(options.legend || {})
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: showTotal,
                        total: {
                            show: showTotal,
                            label: totalLabel,
                            color: textColor,
                            formatter: totalFormatter
                        },
                        value: {
                            show: showTotal,
                            color: isDarkMode ? '#fff' : '#111827',
                            fontSize: '22px',
                            fontWeight: 700,
                        }
                    },
                    ...(options.plotOptions?.pie?.donut || {})
                },
                ...(options.plotOptions?.pie || {})
            },
            ...(options.plotOptions || {})
        },
        stroke: {
            show: true,
            width: 0,
            ...(options.stroke || {})
        },
        chart: {
            ...apexData.donutChart.options.chart,
            height: height,
            foreColor: textColor,
            ...(options.chart || {})
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
            type="donut"
            height={height}
        />
    );
};

export default Donut;
