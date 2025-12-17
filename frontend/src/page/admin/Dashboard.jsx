import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  Clock, 
  AlertTriangle,
  Calendar
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import dashboardApi from "../../api/dashboardApi";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderTypeStats, setOrderTypeStats] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [period, setPeriod] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewRes, revenueRes, topProductsRes, orderTypeRes, statusRes] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.getRevenue(period),
        dashboardApi.getTopProducts(5),
        dashboardApi.getOrderType(),
        dashboardApi.getOrderStatus()
      ]);

      setOverview(overviewRes);
      setRevenueData(revenueRes.data);
      setTopProducts(topProductsRes);
      setOrderTypeStats(orderTypeRes);
      setOrderStatusStats(statusRes);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format data cho biểu đồ doanh thu
  const formatRevenueData = () => {
    return revenueData.map((item) => {
      let label = '';
      if (period === 'day') {
        label = `${item._id.day}/${item._id.month}`;
      } else if (period === 'week') {
        label = `Tuần ${item._id.week}`;
      } else if (period === 'month') {
        label = `Tháng ${item._id.month}`;
      } else if (period === 'quarter') {
        label = `Q${item._id.quarter}`;
      }
      return {
        label,
        revenue: item.totalRevenue,
        orders: item.totalOrders
      };
    });
  };

  // Format data cho biểu đồ tròn
  const formatPieData = (data, labelMap) => {
    return data.map(item => ({
      name: labelMap[item._id] || item._id,
      value: item.count,
      revenue: item.revenue || 0
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Doanh thu hôm nay"
          value={formatCurrencyVN(overview?.todayRevenue || 0)}
          bgColor="bg-green-500"
        />
        <StatCard
          icon={<ShoppingCart className="w-8 h-8" />}
          title="Đơn hàng hôm nay"
          value={overview?.todayOrders || 0}
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Tổng khách hàng"
          value={overview?.totalCustomers || 0}
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={<Package className="w-8 h-8" />}
          title="Sản phẩm đang bán"
          value={overview?.totalProducts || 0}
          bgColor="bg-yellow-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đơn đang xử lý</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {overview?.processingOrders || 0}
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">NVL sắp hết</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {overview?.lowStockIngredients || 0}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đặt bàn hôm nay</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {overview?.todayReservations || 0}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Biểu đồ doanh thu</h2>
          <div className="flex gap-2">
            {[
              { key: 'day', label: 'Ngày' },
              { key: 'week', label: 'Tuần' },
              { key: 'month', label: 'Tháng' },
              { key: 'quarter', label: 'Quý' }
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => setPeriod(btn.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  period === btn.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatRevenueData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatCurrencyVN(value)}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              name="Doanh thu"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Top 5 sản phẩm bán chạy
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalQuantity" fill="#10b981" name="Số lượng" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Loại đơn hàng
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatPieData(orderTypeStats, {
                  ONLINE: 'Online',
                  OFFLINE: 'Tại quán'
                })}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderTypeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Trạng thái đơn hàng
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatPieData(orderStatusStats, {
                  PROCESSING: 'Đang xử lý',
                  COMPLETED: 'Hoàn tất',
                  CANCELLED: 'Đã hủy'
                })}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Chi tiết sản phẩm bán chạy
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Số lượng
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm">{product.productName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      {product.totalQuantity}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {formatCurrencyVN(product.totalRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, bgColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${bgColor} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}