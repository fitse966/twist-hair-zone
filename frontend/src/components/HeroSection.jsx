import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle,
  MessageCircle,
  Scissors,
  Menu,
  X,
} from "lucide-react";

const HeroSection = ({ onBookAppointment, onGoToAdmin, onLearnMore }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Clock,
      text: "Quick & Easy Booking",
      color: "text-amber-600",
      description:
        "Book your appointment in just a few clicks with our streamlined booking system designed for your convenience.",
      image: "images/features/quick-booking.jpg",
    },
    {
      icon: CheckCircle,
      text: "Get Confirmation Email",
      color: "text-rose-600",
      description:
        "Receive instant confirmation and reminders for your scheduled appointments to keep you informed.",
      image: "images/features/confirmation.jpg",
    },
    {
      icon: MessageCircle,
      text: "Contact Us",
      color: "text-purple-600",
      description:
        "Our friendly team is here to answer all your questions and provide the support you need.",
      image: "images/features/contact-us.jpg",
    },
  ];

  const galleryImages = [
    "images/gallery/style1.jpg",
    "images/gallery/style2.jpg",
    "images/gallery/style3.jpg",
    "images/gallery/style4.jpg",
    "images/gallery/style5.jpg",
    "images/gallery/style6.jpg",
    "images/gallery/style7.jpg",
    "images/gallery/style8.jpg",
    "images/gallery/style9.jpg",
    "images/gallery/style10.jpg",
  ];

  const scrollToSection = (sectionId) => {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sectionId === "gallery") {
      const gallerySection = document.getElementById("gallery-section");
      gallerySection?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

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
      </div>

      {/* Fixed Header */}
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
              onClick={() => scrollToSection("home")}
            >
              <Scissors className="w-8 h-8 text-rose-600" />
              <span className="text-2xl font-sans font-bold text-gray-800 tracking-tight">
                Twist Zone
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", action: () => scrollToSection("home") },
                { name: "About Us", action: onLearnMore },
                { name: "Book Appointment", action: onBookAppointment },
                { name: "Gallery", action: () => scrollToSection("gallery") },
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
                { name: "Home", action: () => scrollToSection("home") },
                { name: "About Us", action: onLearnMore },
                { name: "Book Appointment", action: onBookAppointment },
                { name: "Gallery", action: () => scrollToSection("gallery") },
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
        {/* Hero Section with Full Width Background Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-16"
        >
          {/* Background Image - Full Width */}
          <div className="absolute inset-0 w-full">
            <img
              src="images/hero/hero-bg.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 py-20 px-4 text-center container mx-auto max-w-7xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-sans font-medium tracking-wide">
                Premium Hair Experience
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-white mb-6 leading-tight tracking-tight"
            >
              Your{" "}
              <span className="bg-gradient-to-r from-amber-300 via-rose-200 to-purple-300 bg-clip-text text-transparent">
                Twist
              </span>
              <br />
              Zone
            </motion.h1>

            {/* Buttons Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.button
                onClick={onBookAppointment}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-lg px-8 py-4 rounded-2xl font-sans font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
              >
                <Calendar className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Book Your Appointment Now
              </motion.button>

              <motion.button
                onClick={onLearnMore}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/50 text-white text-lg px-8 py-4 rounded-2xl font-sans font-semibold bg-white/10 backdrop-blur-sm hover:border-amber-300 hover:bg-white/20 transition-all duration-300"
              >
                About Us
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto max-w-7xl">
          {/* Premium Hair Experience Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Photo on Left - Half centimeter from left margin */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative -ml-2"
              >
                <img
                  src="images/hero/premium-experience.jpg"
                  alt="Premium Hair Experience"
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              </motion.div>

              {/* Text on Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <h2 className="text-3xl lg:text-4xl font-sans font-bold text-gray-900 mb-4 leading-tight">
                  Premium Hair Experience
                </h2>
                <p className="text-gray-600 leading-relaxed font-sans">
                  Discover the ultimate hair care experience with our expert
                  stylists and premium products. We're dedicated to bringing out
                  your natural beauty with personalized service and attention to
                  detail.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Where Artistry Meets Appointment Section - Text Overlay on Image */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 relative rounded-3xl overflow-hidden"
          >
            {/* Background Image for Artistry Section */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="images/hero/artistry-bg.jpg"
                alt="Artistry Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 py-20 px-8 text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl lg:text-4xl text-white max-w-4xl mx-auto leading-relaxed font-sans italic font-light tracking-wide"
              >
                Where artistry meets appointment. In moments, book your
                consultation and begin your style's next beautiful chapter.
              </motion.p>
            </div>
          </motion.section>

          {/* Features Section - Images half centimeter from screen margins */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20 space-y-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                {/* Quick & Easy Booking: Text on LEFT, Photo on RIGHT */}
                {index === 0 && (
                  <>
                    {/* Text on LEFT - Desktop */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="hidden lg:flex flex-col space-y-4 text-center lg:text-left"
                    >
                      <div
                        className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center shadow-sm mx-auto lg:mx-0`}
                      >
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-sans font-semibold text-gray-800 tracking-wide">
                        {feature.text}
                      </h3>
                      <p className="text-gray-600 font-sans leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                    {/* Photo on RIGHT - Desktop - Half centimeter from right margin */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="hidden lg:block relative -mr-2"
                    >
                      <img
                        src={feature.image}
                        alt={feature.text}
                        className="w-full h-56 object-cover rounded-xl shadow-md"
                      />
                    </motion.div>

                    {/* Mobile Layout - Text then Photo */}
                    <div className="lg:hidden space-y-6">
                      <div className="flex flex-col space-y-4 text-center">
                        <div
                          className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center shadow-sm mx-auto`}
                        >
                          <feature.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-sans font-semibold text-gray-800 tracking-wide">
                          {feature.text}
                        </h3>
                        <p className="text-gray-600 font-sans leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="relative">
                        <img
                          src={feature.image}
                          alt={feature.text}
                          className="w-full h-56 object-cover rounded-xl shadow-md"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Get Confirmation Email: Photo on LEFT, Text on RIGHT */}
                {index === 1 && (
                  <>
                    {/* Photo on LEFT - Desktop - Half centimeter from left margin */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="hidden lg:block relative -ml-2"
                    >
                      <img
                        src={feature.image}
                        alt={feature.text}
                        className="w-full h-56 object-cover rounded-xl shadow-md"
                      />
                    </motion.div>
                    {/* Text on RIGHT - Desktop */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="hidden lg:flex flex-col space-y-4 text-center lg:text-left"
                    >
                      <div
                        className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center shadow-sm mx-auto lg:mx-0`}
                      >
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-sans font-semibold text-gray-800 tracking-wide">
                        {feature.text}
                      </h3>
                      <p className="text-gray-600 font-sans leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>

                    {/* Mobile Layout - Text then Photo */}
                    <div className="lg:hidden space-y-6">
                      <div className="flex flex-col space-y-4 text-center">
                        <div
                          className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center shadow-sm mx-auto`}
                        >
                          <feature.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-sans font-semibold text-gray-800 tracking-wide">
                          {feature.text}
                        </h3>
                        <p className="text-gray-600 font-sans leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="relative">
                        <img
                          src={feature.image}
                          alt={feature.text}
                          className="w-full h-56 object-cover rounded-xl shadow-md"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Contact Us: Text on LEFT, Photo on RIGHT */}
                {index === 2 && (
                  <>
                    {/* Text on LEFT - Desktop */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="hidden lg:flex flex-col space-y-4 text-center lg:text-left"
                    >
                      <div
                        className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center shadow-sm mx-auto lg:mx-0`}
                      >
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-sans font-semibold text-gray-800 tracking-wide">
                        {feature.text}
                      </h3>
                      <p className="text-gray-600 font-sans leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                    {/* Photo on RIGHT - Desktop - Half centimeter from right margin */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="hidden lg:block relative -mr-2"
                    >
                      <img
                        src={feature.image}
                        alt={feature.text}
                        className="w-full h-56 object-cover rounded-xl shadow-md"
                      />
                    </motion.div>

                    {/* Mobile Layout - Text then Photo */}
                    <div className="lg:hidden space-y-6">
                      <div className="flex flex-col space-y-4 text-center">
                        <div
                          className={`w-14 h-14 ${feature.color} bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl flex items-center justify-center shadow-sm mx-auto`}
                        >
                          <feature.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-sans font-semibold text-gray-800 tracking-wide">
                          {feature.text}
                        </h3>
                        <p className="text-gray-600 font-sans leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="relative">
                        <img
                          src={feature.image}
                          alt={feature.text}
                          className="w-full h-56 object-cover rounded-xl shadow-md"
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.section>

          {/* Animated Gallery Section */}
          <motion.section
            id="gallery-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50/30 to-rose-50/30 rounded-3xl p-12 border border-amber-100/50"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-sans font-bold text-center text-gray-800 mb-12"
            >
              Our Style Gallery
            </motion.h2>

            {/* Top Row - Scroll Right */}
            <motion.div
              className="flex space-x-6 mb-6"
              animate={{ x: [0, -1030] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {galleryImages.slice(0, 5).map((src, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex-shrink-0 w-64 h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Hair Style ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
              {/* Duplicate for seamless loop */}
              {galleryImages.slice(0, 5).map((src, index) => (
                <motion.div
                  key={`dup-${index}`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex-shrink-0 w-64 h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Hair Style ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Row - Scroll Left */}
            <motion.div
              className="flex space-x-6"
              animate={{ x: [-1030, 0] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {galleryImages.slice(5, 10).map((src, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex-shrink-0 w-64 h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Hair Style ${index + 6}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
              {/* Duplicate for seamless loop */}
              {galleryImages.slice(5, 10).map((src, index) => (
                <motion.div
                  key={`dup-${index}`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex-shrink-0 w-64 h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Hair Style ${index + 6}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
