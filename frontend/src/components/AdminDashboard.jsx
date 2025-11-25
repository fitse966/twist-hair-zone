import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  LogOut,
  Menu,
  Search,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  TrendingUp,
  User,
} from "lucide-react";
import DateController from "./DateController";

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch real data from backend
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      // Fetch stats
      const statsResponse = await fetch(
        "http://twist-hair-backend.onrender.com/api/admin/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response is JSON
      const contentType = statsResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data.stats || {});
        }
      }

      // Fetch appointments
      const appointmentsResponse = await fetch(
        "http://twist-hair-backend.onrender.com/api/admin/appointments?limit=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        appointmentsResponse.headers
          .get("content-type")
          ?.includes("application/json")
      ) {
        const appointmentsData = await appointmentsResponse.json();
        if (appointmentsData.success) {
          console.log(
            "📊 Appointments loaded:",
            appointmentsData.data.appointments
          );
          setAppointments(appointmentsData.data.appointments || []);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Use mock data when backend fails
      setStats({
        totalBookings: 15,
        pendingBookings: 3,
        confirmedBookings: 8,
        completedBookings: 3,
        canceledBookings: 1,
        todayBookings: 2,
      });
      setAppointments([
        {
          id: 1,
          name: "Sample Customer",
          email: "customer@example.com",
          phone: "123-456-7890",
          date: "2024-01-20",
          time_slot: "10 am - 12 pm",
          status: "pending",
          message: "Sample appointment for testing",
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://twist-hair-backend.onrender.com/api/admin/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: newStatus } : apt
            )
          );
          fetchDashboardData();
          alert("Status updated successfully!");
          return;
        }
      }
      alert("Failed to update status");
    } catch (error) {
      console.error("Error updating status:", error);
      // Update locally even if API fails
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
      alert("Status updated locally (API connection issue)");
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://twist-hair-backend.onrender.com/api/admin/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.filter((apt) => apt.id !== appointmentId)
          );
          setDeleteConfirm(null);
          fetchDashboardData();
          alert("Appointment deleted successfully!");
          return;
        }
      }
      alert("Failed to delete appointment");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Delete locally even if API fails
      setAppointments((prevAppointments) =>
        prevAppointments.filter((apt) => apt.id !== appointmentId)
      );
      setDeleteConfirm(null);
      alert("Appointment deleted locally (API connection issue)");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const confirmDelete = (appointment) => {
    setDeleteConfirm(appointment);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Filter appointments based on search
  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm)
  );

  // Filter appointments with messages
  const appointmentsWithMessages = appointments.filter(
    (apt) => apt.message && apt.message.trim() !== ""
  );

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      canceled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
            {trend && (
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const formatDisplayDate = (dateStr) => {
    return new Date(dateStr + "T00:00:00-06:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Winnipeg",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Appointment
                </h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <p className="font-semibold text-gray-900">
                {deleteConfirm.name}
              </p>
              <p className="text-gray-600">
                {formatDisplayDate(deleteConfirm.date)}
              </p>
              <p className="text-gray-600">{deleteConfirm.time_slot}</p>
              <p className="text-sm text-gray-500 mt-1">
                {deleteConfirm.email}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAppointment(deleteConfirm.id)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-medium py-3 px-6 rounded-xl transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl border-r border-gray-200 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">YZ</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Your Twist Zone
                  </h1>
                  <p className="text-gray-600 text-sm">Admin Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
              {[
                {
                  id: "bookings",
                  label: "Appointment Bookings",
                  icon: Calendar,
                },
                { id: "messages", label: "User Messages", icon: Mail },
                {
                  id: "date-controller",
                  label: "Date Controller",
                  icon: Calendar,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {admin?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">
                    {admin?.name || "Admin"}
                  </p>
                  <p className="text-gray-600 text-xs truncate">
                    {admin?.email || "admin@example.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === "bookings"
                    ? "Appointment Bookings"
                    : activeTab === "messages"
                    ? "User Messages"
                    : activeTab === "date-controller"
                    ? "Date Controller"
                    : "Dashboard"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {activeTab === "bookings" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Users}
                    label="Total Bookings"
                    value={stats.totalBookings}
                    color="bg-gradient-to-r from-purple-600 to-purple-700"
                    trend="+12%"
                  />
                  <StatCard
                    icon={Clock}
                    label="Pending"
                    value={stats.pendingBookings}
                    color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Confirmed"
                    value={stats.confirmedBookings}
                    color="bg-gradient-to-r from-blue-500 to-blue-600"
                    trend="+8%"
                  />
                  <StatCard
                    icon={Calendar}
                    label="Today"
                    value={stats.todayBookings}
                    color="bg-gradient-to-r from-green-500 to-green-600"
                  />
                </div>

                {/* Appointments Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Appointments
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {filteredAppointments.length} appointment(s) found
                    </p>
                  </div>

                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No Appointments Found
                      </p>
                      <p className="text-sm">
                        {searchTerm
                          ? "No appointments match your search"
                          : "Bookings will appear here when users make appointments"}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredAppointments.map((appointment, index) => (
                            <motion.tr
                              key={appointment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {appointment.name}
                                  </p>
                                  {appointment.message && (
                                    <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                                      {appointment.message}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-gray-900">
                                  {formatDisplayDate(appointment.date)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {appointment.time_slot}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                                  <Mail className="w-4 h-4" />
                                  <span>{appointment.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <span>{appointment.phone}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  className={`text-sm border-0 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500 ${getStatusColor(
                                    appointment.status
                                  )}`}
                                  value={appointment.status}
                                  onChange={(e) =>
                                    updateAppointmentStatus(
                                      appointment.id,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="canceled">Canceled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => confirmDelete(appointment)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete appointment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    User Messages
                  </h2>

                  {appointmentsWithMessages.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No User Messages
                      </p>
                      <p className="text-sm">
                        Messages from users will appear here when they include
                        them in bookings
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointmentsWithMessages.map((appointment, index) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {appointment.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDisplayDate(appointment.date)} •{" "}
                                  {appointment.time_slot}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                className={`text-sm border-0 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500 ${getStatusColor(
                                  appointment.status
                                )}`}
                                value={appointment.status}
                                onChange={(e) =>
                                  updateAppointmentStatus(
                                    appointment.id,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                              </select>
                              <button
                                onClick={() => confirmDelete(appointment)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete appointment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {appointment.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{appointment.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.phone}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ✅ DATE CONTROLLER TAB */}
            {activeTab === "date-controller" && <DateController />}
          </main>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
