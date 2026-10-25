import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext';

const DashboardChart = ({ type, series, options = {}, height = 300 }) => {
    const { theme } = useTheme();

    const actualTheme = useMemo(() => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme;
    }, [theme]);

    const darkTextColor = '#d1d5db';
    const lightTextColor = '#6b7280';
    const textColor = actualTheme === 'dark' ? darkTextColor : lightTextColor;
    const gridColor = actualTheme === 'dark' ? '#374151' : '#e5e7eb';

    const mergedOptions = useMemo(() => {
        return {
            ...options,
            chart: {
                ...options.chart,
                type,
                height,
                fontFamily: 'Inter, sans-serif',
                toolbar: {
                    show: false,
                    ...(options.chart?.toolbar || {})
                }
            },
            theme: {
                mode: actualTheme,
                ...(options.theme || {})
            },
            xaxis: {
                ...options.xaxis,
                labels: {
                    style: {
                        colors: textColor,
                        fontSize: '12px',
                        ...(options.xaxis?.labels?.style || {})
                    },
                    ...(options.xaxis?.labels || {})
                }
            },
            yaxis: {
                ...options.yaxis,
                labels: {
                    style: {
                        colors: textColor,
                        fontSize: '12px',
                        ...(options.yaxis?.labels?.style || {})
                    },
                    ...(options.yaxis?.labels || {})
                }
            },
            grid: {
                borderColor: gridColor,
                strokeDashArray: 4,
                ...(options.grid || {})
            },
            legend: {
                labels: {
                    colors: textColor,
                    ...(options.legend?.labels || {})
                },
                ...(options.legend || {})
            },
            tooltip: {
                theme: actualTheme,
                ...(options.tooltip || {})
            }
        };
    }, [options, type, height, actualTheme, textColor, gridColor]);

    return (
        <ReactApexChart
            options={mergedOptions}
            series={series}
            type={type}
            height={height}
            width="100%"
        />
    );
};

export default DashboardChart;
