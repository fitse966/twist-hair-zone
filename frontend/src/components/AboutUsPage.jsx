import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  Menu,
  X,
  Target,
  Heart,
  Star,
  Award,
  Clock,
  Phone,
  MapPin,
  Mail,
  Calendar,
} from "lucide-react";

const AboutUsPage = ({ onBack, onBookAppointment, onGoToAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Master Stylist",
      image: "images/about/team-sarah.jpg",
      experience: "8+ years",
      specialty: "Color Specialist",
    },
    {
      name: "Mike Chen",
      role: "Senior Barber",
      image: "images/about/team-mike.jpg",
      experience: "6+ years",
      specialty: "Modern Cuts",
    },
    {
      name: "Emily Rodriguez",
      role: "Beauty Director",
      image: "images/about/team-emily.jpg",
      experience: "10+ years",
      specialty: "Bridal Styling",
    },
    {
      name: "David Kim",
      role: "Texture Expert",
      image: "images/about/team-david.jpg",
      experience: "7+ years",
      specialty: "Curly Hair",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "We use only the finest products and techniques to ensure your hair looks and feels amazing.",
      color: "text-amber-600",
    },
    {
      icon: Heart,
      title: "Personalized Service",
      description:
        "Every service is tailored to your unique style, hair type, and personal preferences.",
      color: "text-rose-600",
    },
    {
      icon: Clock,
      title: "Convenient Booking",
      description:
        "Easy online scheduling that fits your busy lifestyle with instant confirmations.",
      color: "text-purple-600",
    },
    {
      icon: Star,
      title: "Expert Stylists",
      description:
        "Our team consists of highly trained professionals with years of experience.",
      color: "text-blue-600",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Happy Clients" },
    { number: "8+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "15+", label: "Professional Awards" },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-200/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Soft Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-50/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-50/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-50/10 rounded-full blur-3xl"></div>
      </div>

      {/* Fixed Header - Exact same as Hero Page */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={onBack}
            >
              <Scissors className="w-8 h-8 text-rose-600" />
              <span className="text-2xl font-sans font-bold text-gray-800 tracking-tight">
                Twist Zone
              </span>
            </motion.div>

            {/* Desktop Navigation - Same as Hero Page */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", action: onBack },
                { name: "Book Appointment", action: onBookAppointment },
                { name: "Admin Access", action: onGoToAdmin },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ y: -2 }}
                  className="text-gray-600 hover:text-rose-600 font-sans font-medium transition-colors relative group text-sm tracking-wide"
                  onClick={item.action}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isMenuOpen ? 1 : 0,
              height: isMenuOpen ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4 border-t border-gray-100 mt-4">
              {[
                { name: "Home", action: onBack },
                { name: "Book Appointment", action: onBookAppointment },
                { name: "Admin Access", action: onGoToAdmin },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left text-gray-600 hover:text-rose-600 font-sans font-medium py-2 px-4 rounded-lg hover:bg-rose-50 transition-all duration-200"
                  onClick={item.action}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </nav>
      </motion.header>

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto max-w-7xl px-6">
          {/* Mission Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-4xl font-sans font-bold text-gray-800 mb-6">
                  About Twist Zone
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Welcome to{" "}
                  <span className="text-rose-600 font-semibold">
                    Twist Zone
                  </span>{" "}
                  — where style, creativity, and comfort come together. Our
                  mission is to provide exceptional beauty and hair styling
                  services that bring out your best look.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Whether you're preparing for a special event or simply need a
                  refreshing new look, we're here to make it happen with
                  professionalism and care. We believe that everyone deserves to
                  feel confident and beautiful in their own skin.
                </p>

                <motion.button
                  onClick={onBookAppointment}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-lg px-8 py-4 rounded-2xl font-sans font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
                >
                  <Calendar className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Book Your Appointment Now
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <img
                  src="images/about/salon-interior.jpg"
                  alt="Our Salon"
                  className="w-full h-96 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Target className="w-8 h-8 text-rose-600" />
                    <div>
                      <h3 className="font-sans font-bold text-gray-800">
                        Our Vision
                      </h3>
                      <p className="text-sm text-gray-600">
                        To be the most trusted salon in town
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl p-12 border border-amber-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-sans font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-sans font-bold text-gray-800 mb-4">
                Why Choose Twist Zone?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to providing you with the best hair care
                experience possible
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-sans font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Team Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-sans font-bold text-gray-800 mb-4">
                Meet Our Expert Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our talented stylists are passionate about creating beautiful
                looks that make you feel confident
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-sans font-bold text-gray-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-rose-600 font-semibold mb-3">
                      {member.role}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{member.experience} experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Specialty: {member.specialty}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Contact Info */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl p-12 border border-amber-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-sans font-bold text-gray-800 mb-4">
                Visit Us Today
              </h2>
              <p className="text-lg text-gray-600">
                We'd love to welcome you to our salon
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <MapPin className="w-8 h-8 text-rose-600 mx-auto mb-4" />
                <h3 className="font-sans font-bold text-gray-800 mb-2">
                  Location
                </h3>
                <p className="text-gray-600">
                  123 Beauty Street
                  <br />
                  New York, NY 10001
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <Phone className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                <h3 className="font-sans font-bold text-gray-800 mb-2">
                  Phone
                </h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-md text-center"
              >
                <Mail className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-sans font-bold text-gray-800 mb-2">
                  Email
                </h3>
                <p className="text-gray-600">hello@twistzone.com</p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
