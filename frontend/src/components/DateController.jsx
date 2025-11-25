import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Trash2,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const DateController = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [deletedSlots, setDeletedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeView, setActiveView] = useState("calendar");
  const [error, setError] = useState(null);

  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("adminToken");

      console.log("🔄 Fetching available dates...");
      const response = await fetch(
        "http://twist-hair-backend.onrender.com/api/admin/date-controller/available-dates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 API Response:", data);

      if (data.success) {
        setAvailableDates(data.data || []);
        console.log("✅ Dates loaded:", data.data?.length || 0);
      } else {
        throw new Error(data.message || "Failed to load dates");
      }
    } catch (error) {
      console.error("❌ Error fetching available dates:", error);
      setError(error.message);
      setAvailableDates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDeletedSlots = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://twist-hair-backend.onrender.com/api/admin/date-controller/deleted-slots",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDeletedSlots(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching deleted slots:", error);
    }
  };

  useEffect(() => {
    fetchAvailableDates();
    fetchDeletedSlots();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAvailableDates();
    fetchDeletedSlots();
  };

  const deleteSlot = async (date, timeSlot) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://twist-hair-backend.onrender.com/api/admin/date-controller/slot/${date}/${encodeURIComponent(
          timeSlot
        )}`,
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
          alert("Time slot disabled successfully!");
          fetchAvailableDates();
          fetchDeletedSlots();
        }
      } else {
        alert("Failed to disable time slot");
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert("Error disabling time slot");
    }
  };

  const restoreSlot = async (date, timeSlot) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://twist-hair-backend.onrender.com/api/admin/date-controller/restore-slot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: date,
            time_slot: timeSlot,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Time slot restored successfully!");
          fetchAvailableDates();
          fetchDeletedSlots();
        }
      } else {
        alert("Failed to restore time slot");
      }
    } catch (error) {
      console.error("Error restoring slot:", error);
      alert("Error restoring time slot");
    }
  };

  const getSlotStatusColor = (slot) => {
    if (slot.booked) return "bg-blue-100 text-blue-800 border-blue-200";
    if (slot.adminDisabled) return "bg-red-100 text-red-800 border-red-200";
    if (slot.available) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getSlotStatusText = (slot) => {
    if (slot.booked) return "Booked by Customer";
    if (slot.adminDisabled) return "Disabled by Admin";
    if (slot.available) return "Available";
    return "Unavailable";
  };

  const getSlotStatusIcon = (slot) => {
    if (slot.booked) return <CheckCircle className="w-4 h-4" />;
    if (slot.adminDisabled) return <XCircle className="w-4 h-4" />;
    if (slot.available) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600">Loading date controller...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Dates
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (availableDates.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Dates Available
        </h3>
        <p className="text-gray-600 mb-4">
          No weekend dates found in the system
        </p>
        <button
          onClick={handleRefresh}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Date Controller</h2>
          <p className="text-gray-600">
            Manage available time slots and view booked appointments
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeView === "calendar"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setActiveView("deleted")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeView === "deleted"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Disabled Slots
            </button>
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

      {/* Calendar View */}
      {activeView === "calendar" && (
        <div className="grid gap-6">
          {availableDates.map((dateObj, index) => (
            <motion.div
              key={dateObj.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Date Header */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {dateObj.displayDate}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{dateObj.availableSlotsCount} available</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{dateObj.bookedCount} booked</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>{dateObj.disabledCount} disabled</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dateObj.availableSlots &&
                    dateObj.availableSlots.map((slot, slotIndex) => (
                      <motion.div
                        key={slot.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + slotIndex * 0.05 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          slot.available
                            ? "bg-white border-green-200 hover:border-green-300 hover:shadow-md cursor-pointer"
                            : "bg-gray-50 border-gray-200 opacity-75"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-gray-900">
                              {slot.display}
                            </span>
                          </div>
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getSlotStatusColor(
                              slot
                            )}`}
                          >
                            {getSlotStatusIcon(slot)}
                            <span>{getSlotStatusText(slot)}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          {slot.available ? (
                            <button
                              onClick={() =>
                                deleteSlot(dateObj.date, slot.value)
                              }
                              className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Disable</span>
                            </button>
                          ) : slot.adminDisabled ? (
                            <button
                              onClick={() =>
                                restoreSlot(dateObj.date, slot.value)
                              }
                              className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Enable</span>
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {slot.booked
                                ? "Booked by customer"
                                : "Unavailable"}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Deleted Slots View */}
      {activeView === "deleted" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Disabled Time Slots
            </h3>
            <p className="text-gray-600">
              Slots that have been manually disabled by admin
            </p>
          </div>

          {deletedSlots.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                No Disabled Slots
              </p>
              <p className="text-sm">Disabled time slots will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {deletedSlots.map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">
                          {slot.displayDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">{slot.time_slot}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => restoreSlot(slot.date, slot.time_slot)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Enable Slot</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateController;
