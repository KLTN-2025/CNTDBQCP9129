import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  Filter,
  Inbox,
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
  ResponsiveContainer,
} from "recharts";
import dashboardApi from "../../api/dashboardApi";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import { toast } from "react-toastify";

const COLORS = ["#bb0c0c", "#ede324", "#3cb755", "#8b5cf6", "#3b82f6"];

// Component hiển thị khi không có dữ liệu
const EmptyState = ({ message = "Chưa có dữ liệu" }) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
    <Inbox className="w-16 h-16 mb-3" />
    <p className="text-lg font-medium">{message}</p>
    <p className="text-sm mt-1">Dữ liệu sẽ hiển thị khi có giao dịch</p>
  </div>
);

// Hàm lấy ngày hiện tại theo timezone Việt Nam
const getVietnamToday = () => {
  const now = new Date();
  const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const year = vietnamTime.getFullYear();
  const month = String(vietnamTime.getMonth() + 1).padStart(2, "0");
  const day = String(vietnamTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderTypeStats, setOrderTypeStats] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [period, setPeriod] = useState("day");
  const [loading, setLoading] = useState(true);

  // Bộ lọc ngày - mặc định là ngày hôm nay theo timezone Việt Nam
  const today = getVietnamToday();
  const [dateFilter, setDateFilter] = useState({
    startDate: today,
    endDate: today,
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (filterApplied = isFilterApplied, filter = dateFilter, currentPeriod = period) => {
    try {
      setLoading(true);
      // LUÔN gửi startDate và endDate, giống Orders
      const params = filterApplied ? filter : { startDate: today, endDate: today };
      
      console.log('Dashboard params:', params);
      console.log('Today:', today);

      const [overviewRes, revenueRes, topProductsRes, orderTypeRes, statusRes] =
        await Promise.all([
          dashboardApi.getOverview(params.startDate, params.endDate),
          dashboardApi.getRevenue(currentPeriod, params.startDate, params.endDate),
          dashboardApi.getTopProducts(5, params.startDate, params.endDate),
          dashboardApi.getOrderType(params.startDate, params.endDate),
          dashboardApi.getOrderStatus(params.startDate, params.endDate),
        ]);
      
      console.log('Overview response:', overviewRes);

      setOverview(overviewRes);
      setRevenueData(revenueRes.data || []);
      setTopProducts(topProductsRes || []);
      setOrderTypeStats(orderTypeRes || []);
      setOrderStatusStats(statusRes || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    loadDashboardData(isFilterApplied, dateFilter, newPeriod);
  };

  const handleDateChange = (field, value) => {
    // Kiểm tra không được chọn ngày tương lai
    const selectedDate = new Date(value + "T00:00:00");
    const todayDate = new Date(today + "T00:00:00");

    if (selectedDate > todayDate) {
      toast.error("Không thể chọn ngày trong tương lai!");
      return;
    }

    setDateFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    // Validate startDate <= endDate
    if (new Date(dateFilter.startDate) > new Date(dateFilter.endDate)) {
      toast.error("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!");
      return;
    }
    setIsFilterApplied(true);
    setShowDateFilter(true);
    loadDashboardData(true, dateFilter, period);
  };

  // Format data cho biểu đồ doanh thu
  const formatRevenueData = () => {
    if (!revenueData || revenueData.length === 0) {
      return [];
    }

    return revenueData.map((item) => {
      let label = "";
      if (item._id.day) {
        label = `${item._id.day}/${item._id.month}`;
      } else if (item._id.week) {
        label = `Tuần ${item._id.week}`;
      } else if (item._id.quarter) {
        label = `Q${item._id.quarter}`;
      } else if (item._id.month) {
        label = `Tháng ${item._id.month}`;
      }
      return {
        label,
        revenue: item.totalRevenue,
        orders: item.totalOrders,
      };
    });
  };

  // Custom Tooltip để format tiền
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "Doanh thu" || entry.name === "revenue"
                ? formatCurrencyVN(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format data cho biểu đồ tròn
  const formatPieData = (data, labelMap) => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      name: labelMap[item._id] || item._id,
      value: item.count,
      revenue: item.revenue || 0,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const revenueChartData = formatRevenueData();
  const pieOrderType = formatPieData(orderTypeStats, {
    ONLINE: "Online",
    OFFLINE: "Tại quán",
  });
  const pieOrderStatus = formatPieData(orderStatusStats, {
    PROCESSING: "Đang xử lý",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Thống kê số liệu</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`px-4 py-2 rounded-lg flex items-center cursor-pointer gap-2 transition-colors ${
              showDateFilter
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Lọc ngày
          </button>
        </div>
      </div>

      {/* Date Filter */}
      {showDateFilter && (
        <div className="bg-white p-4 rounded-lg flex shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                max={dateFilter.endDate}
                value={dateFilter.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                max={today}
                min={dateFilter.startDate}
                value={dateFilter.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-end gap-2 ml-4">
            <button
              onClick={handleApplyFilter}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
            >
              Tìm
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-8 h-8" />}
          title={isFilterApplied ? "Doanh thu" : "Doanh thu tháng này"}
          value={formatCurrencyVN(
            isFilterApplied
              ? overview?.periodRevenue
              : overview?.monthRevenue || 0
          )}
          subtitle={
            !isFilterApplied &&
            `Hôm nay: ${formatCurrencyVN(overview?.periodRevenue || 0)}`
          }
          bgColor="bg-green-500"
        />
        <StatCard
          icon={<ShoppingCart className="w-8 h-8" />}
          title={isFilterApplied ? "Đơn hàng" : "Đơn hàng tháng này"}
          value={
            isFilterApplied
              ? overview?.periodOrders
              : overview?.monthOrders || 0
          }
          subtitle={
            !isFilterApplied && `Hôm nay: ${overview?.periodOrders || 0}`
          }
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Tổng người dùng"
          value={
            (overview?.totalCustomers || 0) +
            (overview?.totalManager || 0) +
            (overview?.totalAdmin || 0)
          }
          subtitle={`Khách hàng: ${overview?.totalCustomers || 0} Quản lý: ${
            overview?.totalManager || 0
          } Admin: ${overview?.totalAdmin || 0}`}
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={<Package className="w-8 h-8" />}
          title="Sản phẩm đang bán"
          value={overview?.totalProducts || 0}
          subtitle={`Sản phẩm đang hết hàng: ${
            overview?.outOfStockProducts || 0
          }`}
          bgColor="bg-yellow-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-gray-600 text-sm">
                Nguyên liệu sắp hết và đã hết
              </p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {overview?.lowStockIngredients || 0}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Biểu đồ doanh thu</h2>
        </div>
        {revenueChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
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
        ) : (
          <EmptyState message="Chưa có dữ liệu doanh thu" />
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Top 5 sản phẩm bán chạy
          </h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="productName"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#10b981" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Chưa có sản phẩm bán ra" />
          )}
        </div>

        {/* Order Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Loại đơn hàng
          </h2>
          {pieOrderType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieOrderType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieOrderType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length + 3]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-sm">Đơn: {payload[0].value}</p>
                          <p className="text-sm text-green-600">
                            DT: {formatCurrencyVN(payload[0].payload.revenue)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Chưa có đơn hàng" />
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Trạng thái đơn hàng
          </h2>
          {pieOrderStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieOrderStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieOrderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Chưa có đơn hàng" />
          )}
        </div>

        {/* Top Products Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Chi tiết sản phẩm bán chạy
          </h2>
          {topProducts.length > 0 ? (
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
                      <td className="px-4 py-3 text-sm">
                        {product.productName}
                      </td>
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
          ) : (
            <EmptyState message="Chưa có sản phẩm bán ra" />
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, subtitle, bgColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div
          className={`${bgColor} text-white p-3 rounded-lg flex items-center h-14`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}