import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext';

const SpotTradingChart = ({ height = 400 }) => {
    const { theme } = useTheme();
    const actualTheme = theme === 'system'
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
        : theme;

    const isDarkMode = actualTheme === 'dark';
    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

    // High-Performance Candlestick Data for BTC/USDT
    const generateCandleData = () => {
        const data = [];
        let basePrice = 41500;
        let date = new Date('2024-01-15 00:00');

        for (let i = 0; i < 40; i++) {
            const open = basePrice + (Math.random() - 0.5) * 400;
            const high = open + Math.random() * 200;
            const low = open - Math.random() * 200;
            const close = (open + (Math.random() - 0.5) * 300);

            data.push({
                x: new Date(date),
                y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)]
            });

            date.setHours(date.getHours() + 1);
            basePrice = close;
        }
        return data;
    };

    const chartOptions = {
        chart: {
            type: 'candlestick',
            height: height,
            id: 'trading-chart-main',
            toolbar: {
                show: true,
                autoSelected: 'pan',
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            background: 'transparent',
            animations: { enabled: false },
            fontFamily: 'Inter, sans-serif',
            foreColor: textColor
        },
        plotOptions: {
            candlestick: {
                colors: {
                    positive: '#22c55e',
                    negative: '#ef4444'
                },
                wick: { useFillColor: true }
            }
        },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } }
        },
        xaxis: {
            type: 'datetime',
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
            labels: {
                style: {
                    colors: textColor
                }
            }
        },
        yaxis: {
            opposite: true,
            tooltip: { enabled: true },
            labels: {
                formatter: (val) => '$' + val.toLocaleString(),
                style: {
                    colors: textColor
                }
            }
        },
        tooltip: {
            theme: actualTheme,
            x: { format: 'dd MMM HH:mm' }
        },
        theme: {
            mode: actualTheme
        }
    };

    const series = [{
        name: 'BTC/USDT',
        data: generateCandleData()
    }];

    return (
        <Chart
            options={chartOptions}
            series={series}
            type="candlestick"
            height={height}
        />
    );
};

export default SpotTradingChart;
