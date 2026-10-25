import { useTheme } from '../context/ThemeContext';
import Breadcrumb from './Breadcrumb';
import Donut from '../charts/Donut';
import ColumnChart from '../charts/ColumnChart';
import AreaChart from '../charts/AreaChart';
import BarChart from '../charts/BarChart';

const Index = () => {
    const { primaryColor, textColor, gridColor, theme } = useTheme();

    const commonOptions = {
        chart: {
            fontFamily: 'Inter, sans-serif',
            toolbar: { show: false },
        },
        theme: { mode: theme },
        grid: {

            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: false,

                }
            }
        },
        xaxis: {
            labels: { style: { colors: textColor } },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: { style: { colors: textColor } }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            labels: { colors: textColor }
        }
    };

    return (
        <div className="p-6">
            {/* <!-- Page Header --> */}
            <Breadcrumb title="Dashboard" description="Sales Analytics & Store Management" category="E-Commerce" />

            {/* <!-- Modern KPI Cards with Gradients (4) --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* <!-- Total Revenue --> */}
                <div className="box !p-5 hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="h-12 w-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <i className="ri-money-dollar-circle-line text-2xl"></i>
                            </div>
                            <span className="badge bg-success/10 text-success text-xs"><i className="ri-arrow-up-line"></i>
                                12.5%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-dark dark:text-white mb-1">$54,239</h3>
                        <p className="text-sm text-gray/50 dark:text-white/50">Total Revenue</p>
                        <div className="mt-3 pt-3 border-t border-gray/10">
                            <p className="text-xs text-gray/50 dark:text-white/50">+$2,450 from last month</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Total Orders --> */}
                <div className="box !p-5 hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="h-12 w-12 bg-gradient-to-br from-success to-success/60 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <i className="ri-shopping-cart-line text-2xl"></i>
                            </div>
                            <span className="badge bg-success/10 text-success text-xs"><i className="ri-arrow-up-line"></i>
                                8.3%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-dark dark:text-white mb-1">1,847</h3>
                        <p className="text-sm text-gray/50 dark:text-white/50">Total Orders</p>
                        <div className="mt-3 pt-3 border-t border-gray/10">
                            <p className="text-xs text-gray/50 dark:text-white/50">+142 from last month</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Total Customers --> */}
                <div className="box !p-5 hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-info/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="h-12 w-12 bg-gradient-to-br from-info to-info/60 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <i className="ri-group-line text-2xl"></i>
                            </div>
                            <span className="badge bg-success/10 text-success text-xs"><i className="ri-arrow-up-line"></i>
                                15.2%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-dark dark:text-white mb-1">8,456</h3>
                        <p className="text-sm text-gray/50 dark:text-white/50">Total Customers</p>
                        <div className="mt-3 pt-3 border-t border-gray/10">
                            <p className="text-xs text-gray/50 dark:text-white/50">+1,125 new customers</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Conversion Rate --> */}
                <div className="box !p-5 hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="h-12 w-12 bg-gradient-to-br from-warning to-warning/60 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <i className="ri-line-chart-line text-2xl"></i>
                            </div>
                            <span className="badge bg-danger/10 text-danger text-xs"><i className="ri-arrow-down-line"></i>
                                2.1%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-dark dark:text-white mb-1">3.24%</h3>
                        <p className="text-sm text-gray/50 dark:text-white/50">Conversion Rate</p>
                        <div className="mt-3 pt-3 border-t border-gray/10">
                            <p className="text-xs text-gray/50 dark:text-white/50">Industry avg: 2.8%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Sales Overview & Revenue Breakdown (3:2) --> */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="box p-4 lg:col-span-3">
                    <h5 className="box-header">Sales Overview</h5>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div id="salesOverviewChart" className="w-full overflow-hidden" >
                            <AreaChart
                                categories={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
                                series={[
                                    { name: "Revenue", data: [31000, 40000, 28000, 51000, 42000, 82000, 56000, 68000, 75000, 62000, 85000, 92000] },
                                    { name: "Orders", data: [1100, 1400, 980, 1800, 1500, 2900, 2000, 2400, 2650, 2200, 3000, 3250] }
                                ]}
                                colors={[primaryColor, "#10b981"]}
                                height={350}
                                options={commonOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="box lg:col-span-2">
                    <div className="box-header">Revenue Breakdown</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div id="revenueDonutChart" className="mb-4 w-full overflow-hidden flex justify-center">
                            <Donut
                                labels={["Products", "Services", "Subscriptions"]}
                                series={[60, 30, 10]}
                                showLabels={false}
                                showLegend={false}
                                height={250}
                                colors={[primaryColor, "#10b981", "#f59e0b"]}
                                options={{
                                    ...commonOptions,
                                    stroke: { width: 0 }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <span className="text-gray/50 dark:text-white/50">Products</span>
                                </div>
                                <span className="font-semibold dark:text-white/50">$32,450 (60%)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-success rounded-full"></div>
                                    <span className="text-gray/50 dark:text-white/50">Services</span>
                                </div>
                                <span className="font-semibold dark:text-white/50">$16,225 (30%)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                                    <span className="text-gray/50 dark:text-white/50">Subscriptions</span>
                                </div>
                                <span className="font-semibold dark:text-white/50">$5,408 (10%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Top Products & Recent Orders (2:3) --> */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="box lg:col-span-2">
                    <div className="box-header">Top Selling Products</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div className="space-y-4">
                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <i className="ri-smartphone-line text-primary text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-sm font-semibold dark:text-white/50">iPhone 15 Pro Max</h6>
                                    <p className="text-xs text-gray/50 dark:text-white/50">Electronics</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">$1,299</p>
                                    <p className="text-xs text-gray/50 dark:text-white/50">245 sold</p>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-success/5 hover:bg-success/10 transition-colors cursor-pointer">
                                <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
                                    <i className="ri-macbook-line text-success text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-sm font-semibold dark:text-white/50">MacBook Pro M3</h6>
                                    <p className="text-xs text-gray/50 dark:text-white/50">Computers</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-success">$2,499</p>
                                    <p className="text-xs text-gray/50 dark:text-white/50">189 sold</p>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 hover:bg-warning/10 transition-colors cursor-pointer">
                                <div className="h-12 w-12 bg-warning/20 rounded-lg flex items-center justify-center">
                                    <i className="ri-headphone-line text-warning text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-sm font-semibold dark:text-white/50">AirPods Pro 2</h6>
                                    <p className="text-xs text-gray/50 dark:text-white/50">Audio</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-warning">$249</p>
                                    <p className="text-xs text-gray/50 dark:text-white/50">456 sold</p>
                                </div>
                            </div>

                            <div
                                className="flex items-center gap-3 p-3 rounded-lg bg-info/5 hover:bg-info/10 transition-colors cursor-pointer">
                                <div className="h-12 w-12 bg-info/20 rounded-lg flex items-center justify-center">
                                    <i className="ri-tablet-line text-info text-xl"></i>
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-sm font-semibold dark:text-white/50">iPad Air M2</h6>
                                    <p className="text-xs text-gray/50 dark:text-white/50">Tablets</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-info">$599</p>
                                    <p className="text-xs text-gray/50 dark:text-white/50">312 sold</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="box lg:col-span-3">
                    <div className="box-header">Recent Orders</div>
                    <div className="box-divider"></div>
                    <div className="box-body p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary/10">
                                    <tr>
                                        <th className="th">Order ID
                                        </th>
                                        <th className="th">Customer
                                        </th>
                                        <th className="th">Product
                                        </th>
                                        <th className="th">Amount
                                        </th>
                                        <th className="th">Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/10 dark:divide-white/10">
                                    <tr className="hover:bg-gray/5 dark:hover:bg-white/10">
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">#ORD-2025-1847</td>
                                        <td className="p-3 text-sm dark:text-white/60">John Doe</td>
                                        <td className="p-3 text-sm dark:text-white/60">iPhone 15 Pro Max</td>
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">$1,299</td>
                                        <td className="p-3"><span
                                            className="badge bg-success/10 text-success text-xs">Delivered</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray/5 dark:hover:bg-white/10">
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">#ORD-2025-1846</td>
                                        <td className="p-3 text-sm dark:text-white/60">Jane Smith</td>
                                        <td className="p-3 text-sm dark:text-white/60">MacBook Pro M3</td>
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">$2,499</td>
                                        <td className="p-3"><span
                                            className="badge bg-warning/10 text-warning text-xs">Processing</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray/5 dark:hover:bg-white/10">
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">#ORD-2025-1845</td>
                                        <td className="p-3 text-sm dark:text-white/60">Mike Johnson</td>
                                        <td className="p-3 text-sm dark:text-white/60">AirPods Pro 2</td>
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">$249</td>
                                        <td className="p-3"><span className="badge bg-info/10 text-info text-xs">Shipped</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray/5 dark:hover:bg-white/10">
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">#ORD-2025-1844</td>
                                        <td className="p-3 text-sm dark:text-white/60">Sarah Williams</td>
                                        <td className="p-3 text-sm dark:text-white/60">iPad Air M2</td>
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">$599</td>
                                        <td className="p-3"><span
                                            className="badge bg-success/10 text-success text-xs">Delivered</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray/5 dark:hover:bg-white/10">
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">#ORD-2025-1843</td>
                                        <td className="p-3 text-sm dark:text-white/60">David Brown</td>
                                        <td className="p-3 text-sm dark:text-white/60">Apple Watch Ultra</td>
                                        <td className="p-3 text-sm font-semibold dark:text-white/60">$799</td>
                                        <td className="p-3"><span
                                            className="badge bg-danger/10 text-danger text-xs">Cancelled</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Customer Analytics & Traffic Sources (3:2:2) --> */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-6">
                <div className="box md:col-span-3">
                    <div className="box-header">Customer Analytics</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div id="customerAnalyticsChart" className="w-full overflow-hidden">
                            <ColumnChart
                                categories={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
                                series={[
                                    { name: 'New Customers', data: [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65] },
                                    { name: 'Returning Customers', data: [13, 23, 20, 8, 13, 27, 33, 12, 15, 20, 24, 28] }
                                ]}
                                colors={[primaryColor, "#10b981"]}
                                height={350}
                                options={{
                                    ...commonOptions,
                                    plotOptions: {
                                        bar: { columnWidth: '55%', borderRadius: 4 }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="box md:col-span-2">
                    <div className="box-header">Traffic Sources</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <i className="ri-google-fill text-primary"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">Google</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Organic Search</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-primary">42%</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center">
                                        <i className="ri-arrow-right-line text-success"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">Direct</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Direct Traffic</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-success">28%</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-info/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-info/10 rounded-lg flex items-center justify-center">
                                        <i className="ri-facebook-fill text-info"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">Social Media</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Facebook, Instagram</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-info">18%</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-warning/10 rounded-lg flex items-center justify-center">
                                        <i className="ri-link text-warning"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">Referral</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Other Websites</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-warning">12%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="box md:col-span-2">
                    <div className="box-header">Quick Stats</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                                <p className="text-xs text-gray/50 mb-1 dark:text-white/50">Avg Order Value</p>
                                <h4 className="text-2xl font-bold text-primary">$156</h4>
                                <p className="text-xs text-success mt-1"><i className="ri-arrow-up-line"></i> +5.2%</p>
                            </div>

                            <div className="p-3 rounded-lg border border-success/20 bg-success/5">
                                <p className="text-xs text-gray/50 mb-1 dark:text-white/50">Cart Abandonment</p>
                                <h4 className="text-2xl font-bold text-success">24.5%</h4>
                                <p className="text-xs text-danger mt-1"><i className="ri-arrow-down-line"></i> -2.8%</p>
                            </div>

                            <div className="p-3 rounded-lg border border-info/20 bg-info/5">
                                <p className="text-xs text-gray/50 mb-1 dark:text-white/50">Return Rate</p>
                                <h4 className="text-2xl font-bold text-info">3.2%</h4>
                                <p className="text-xs text-success mt-1"><i className="ri-arrow-down-line"></i> -0.5%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Inventory Status & Top Categories (1:1) --> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="box">
                    <div className="box-header">Inventory Status</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div className="space-y-3">
                            <div
                                className="flex items-center justify-between p-3 rounded-lg border border-success/20 bg-success/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-success/10 rounded-full flex items-center justify-center">
                                        <i className="ri-checkbox-circle-line text-success text-xl"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">In Stock</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Available Products</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-success">1,245</span>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 rounded-lg border border-warning/20 bg-warning/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-warning/10 rounded-full flex items-center justify-center">
                                        <i className="ri-alert-line text-warning text-xl"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">Low Stock</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Needs Reorder</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-warning">87</span>
                            </div>

                            <div
                                className="flex items-center justify-between p-3 rounded-lg border border-danger/20 bg-danger/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-danger/10 rounded-full flex items-center justify-center">
                                        <i className="ri-close-circle-line text-danger text-xl"></i>
                                    </div>
                                    <div>
                                        <h6 className="text-sm font-semibold dark:text-white/50">Out of Stock</h6>
                                        <p className="text-xs text-gray/50 dark:text-white/50">Urgent Action</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-danger">23</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="box">
                    <div className="box-header">Top Categories</div>
                    <div className="box-divider"></div>
                    <div className="box-body">
                        <div id="categoriesChart" className="w-full overflow-hidden">
                            <BarChart
                                categories={['1', '2', '3', '4']}
                                series={[{ data: [42, 28, 18, 12] }]}
                                colors={[primaryColor, "#10b981", "#f59e0b", "#06b6d4"]}
                                height={250}
                                options={{
                                    ...commonOptions,
                                    plotOptions: {
                                        bar: { horizontal: true, borderRadius: 4, distributed: true }
                                    },
                                    legend: {
                                        show: false
                                    },
                                    yaxis: {
                                        labels: {
                                            show: false
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Index
