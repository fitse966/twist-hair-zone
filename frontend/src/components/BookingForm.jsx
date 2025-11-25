import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { bookingAPI } from "../services/api";

const BookingForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time_slot: "",
  });

  // ✅ EXACT SAME FUNCTION AS BACKEND timeSlots.js
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr + "T12:00:00-06:00"); // Winnipeg timezone
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Winnipeg",
    });
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAvailability();
      if (response.success) {
        console.log("📅 Frontend received dates:", response.data);

        // ✅ Use the same date formatting logic
        const correctedDates = response.data.map((dateObj) => ({
          ...dateObj,
          displayDate: formatDisplayDate(dateObj.date),
        }));

        setAvailableDates(correctedDates);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      alert("Error loading available dates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateSelect = (date) => {
    setFormData({
      ...formData,
      date: date.date,
      time_slot: "",
    });
    setStep(2);
  };

  const handleTimeSelect = (timeSlot) => {
    setFormData({
      ...formData,
      time_slot: timeSlot,
    });
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.time_slot
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await bookingAPI.createBooking(formData);

      if (response.success) {
        setBookingSuccess(true);
      } else {
        alert(response.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedDate = availableDates.find((d) => d.date === formData.date);

  if (bookingSuccess) {
    return (
      <div className="min-h-screen app-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-md w-full text-center relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-primary mb-4">
            🎉 Booking Confirmed!
          </h2>
          <p className="text-secondary mb-6 leading-relaxed">
            Your appointment has been successfully booked! See you soon — we'll
            send you a reminder before your appointment.
          </p>

          <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-200">
            <p className="font-semibold text-primary">{formData.name}</p>
            <p className="text-secondary">{selectedDate?.displayDate}</p>
            <p className="text-secondary">{formData.time_slot}</p>
          </div>

          <button onClick={onBack} className="btn-primary w-full">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 max-w-md w-full relative"
      >
        {/* Header with Premium Badge */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-primary hover:text-purple-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          <div className="flex items-center space-x-2 bg-purple-100 rounded-full px-3 py-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-primary text-sm font-medium">Book Now</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 transition-all duration-300 ${
                      step > stepNumber ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Date */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Select Date
                </h2>
                <p className="text-secondary">
                  Choose your preferred weekend date (Saturday & Sunday)
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-secondary mt-2">
                    Loading available dates...
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableDates.map((dateObj) => (
                    <button
                      key={dateObj.date}
                      onClick={() => handleDateSelect(dateObj)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
                    >
                      <div className="font-semibold text-primary group-hover:text-purple-700 transition-colors">
                        {dateObj.displayDate}
                      </div>
                      <div className="text-sm text-secondary mt-1">
                        {dateObj.availableSlots.length} slot(s) available
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Select Time
                </h2>
                <p className="text-secondary">{selectedDate?.displayDate}</p>
              </div>

              <div className="grid gap-3">
                {selectedDate?.availableSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => handleTimeSelect(slot.value)}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-center group hover:scale-105"
                  >
                    <div className="font-semibold text-primary group-hover:text-purple-700 transition-colors">
                      {slot.display}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-secondary hover:text-primary py-3 transition-colors text-center font-medium"
              >
                ← Back to dates
              </button>
            </motion.div>
          )}

          {/* Step 3: Personal Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Your Details
                </h2>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="font-semibold text-primary">
                    {selectedDate?.displayDate}
                  </p>
                  <p className="text-secondary">{formData.time_slot}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-modern"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-modern"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-modern"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-modern"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Booking...
                      </div>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BookingForm;
