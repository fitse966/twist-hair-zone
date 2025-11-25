import axios from "axios";
import { API_BASE_URL } from "../config/socialLinks";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

// Simple mock data
const mockData = {
  success: true,
  data: [
    {
      date: "2024-01-20",
      displayDate: "Saturday, January 20, 2024",
      availableSlots: [
        { value: "10 am - 12 pm", display: "10 am - 12 pm" },
        { value: "2 pm - 4 pm", display: "2 pm - 4 pm" },
        { value: "5 pm - 7 pm", display: "5 pm - 7 pm" },
      ],
    },
  ],
};

export const bookingAPI = {
  getAvailability: async () => {
    try {
      const response = await api.get("/bookings/availability");
      return response.data;
    } catch (error) {
      console.log("Using mock data");
      return mockData;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      console.log("Mock booking");
      return {
        success: true,
        message: "Booking request received!",
        bookingId: 123,
      };
    }
  },
};

export default api;
