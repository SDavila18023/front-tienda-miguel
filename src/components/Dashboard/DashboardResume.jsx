import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  Clock,
  BarChart2,
  Activity,
  Filter,
} from "lucide-react";
import axios from "axios";

function DashboardResume() {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("week"); // 'day', 'week', 'month', 'year'
  const [viewType, setViewType] = useState("line"); // 'line', 'bar'

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userPassword = localStorage.getItem("userPassword");

    if (!userEmail || !userPassword) {
      navigate("/");
    }

    fetchData();
  }, [navigate, timeFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Obtener total de productos
      const productsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/total`
      );
      setTotalProducts(productsResponse.data.total);

      // Obtener ventas
      const salesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/sales`
      );
      const salesData = salesResponse.data;
      
      // Procesar datos según el filtro de tiempo
      const processedData = processDataByTimeFilter(salesData, timeFilter);
      setEarnings(processedData.chartData);
      setTotalEarnings(processedData.total);
      
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para procesar datos según el filtro de tiempo
  const processDataByTimeFilter = (salesData, filter) => {
    const now = new Date();
    let filterDate = new Date();
    let format = {};
    
    // Configurar fecha de filtro y formato según el filtro seleccionado
    switch (filter) {
      case "day":
        filterDate.setDate(now.getDate() - 1);
        format = { hour: "2-digit" };
        break;
      case "week":
        filterDate.setDate(now.getDate() - 7);
        format = { weekday: "short" };
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        format = { day: "2-digit" };
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        format = { month: "short" };
        break;
      default:
        filterDate.setDate(now.getDate() - 7);
        format = { weekday: "short" };
    }

    // Filtrar ventas por fecha
    const filteredSales = salesData.filter(
      (sale) => new Date(sale.date) >= filterDate
    );

    // Agrupar por período
    const earningsByPeriod = {};
    filteredSales.forEach(({ totalPrice, date }) => {
      const dateObj = new Date(date);
      const period = dateObj.toLocaleDateString("es-ES", format);
      earningsByPeriod[period] = (earningsByPeriod[period] || 0) + totalPrice;
    });

    // Convertir a formato de gráfico
    const chartData = Object.entries(earningsByPeriod).map(
      ([period, amount]) => ({
        period,
        amount,
      })
    );

    // Calcular total
    const total = Object.values(earningsByPeriod).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return { chartData, total };
  };

  // Obtener título según filtro de tiempo
  const getFilterTitle = () => {
    switch (timeFilter) {
      case "day":
        return "Hoy";
      case "week":
        return "Esta Semana";
      case "month":
        return "Este Mes";
      case "year":
        return "Este Año";
      default:
        return "Este Período";
    }
  };

  // Calcular el crecimiento
  const calculateGrowth = () => {
    if (earnings.length < 2) return 0;
    
    const firstValue = earnings[0]?.amount || 0;
    const lastValue = earnings[earnings.length - 1]?.amount || 0;
    
    if (firstValue === 0) return 0;
    return ((lastValue / firstValue) * 100 - 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Panel de Control
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/inventario")}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors duration-150 ease-in-out"
            >
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeFilter("day")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  timeFilter === "day"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Clock className="w-3 h-3 inline mr-1" />
                Diario
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  timeFilter === "week"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Activity className="w-3 h-3 inline mr-1" />
                Semanal
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  timeFilter === "month"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Calendar className="w-3 h-3 inline mr-1" />
                Mensual
              </button>
              <button
                onClick={() => setTimeFilter("year")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  timeFilter === "year"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BarChart2 className="w-3 h-3 inline mr-1" />
                Anual
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType("line")}
                className={`p-1.5 rounded-lg ${
                  viewType === "line"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("bar")}
                className={`p-1.5 rounded-lg ${
                  viewType === "bar"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Productos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Productos en Inventario
                </p>
                <h3 className="text-2xl font-bold text-gray-800">{isLoading ? "..." : totalProducts}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Productos actualmente registrados
            </p>
          </div>

          {/* Ganancias */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Ganancias {getFilterTitle()}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isLoading ? "..." : `$${totalEarnings.toLocaleString("es-ES")}`}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Total de ingresos del período
            </p>
          </div>

          {/* Tendencia */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Tendencia
                </p>
                <h3 className={`text-2xl font-bold ${
                  Number(calculateGrowth()) >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {isLoading ? "..." : `${calculateGrowth()}%`}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Comparado con inicio del período
            </p>
          </div>
        </div>

        {/* Gráfico principal */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
              Ganancias {getFilterTitle()}
            </h3>
            <div className="text-sm text-gray-500">
              {isLoading ? (
                <span>Cargando datos...</span>
              ) : (
                <span>{earnings.length} períodos mostrados</span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
            </div>
          ) : (
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                {viewType === "line" ? (
                  <LineChart data={earnings} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        padding: "12px",
                      }}
                      formatter={(value) => [`$${value}`, "Ganancia"]}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#4f46e5", r: 4 }}
                      activeDot={{ r: 6, fill: "#4338ca" }}
                      name="Ganancia"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={earnings} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis 
                      dataKey="period" 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        padding: "12px",
                      }}
                      formatter={(value) => [`$${value}`, "Ganancia"]}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                      name="Ganancia"
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardResume;