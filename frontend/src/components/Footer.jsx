import React from "react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Heart,
} from "lucide-react";
import { socialLinks } from "../config/socialLinks";

const Footer = () => {
  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    whatsapp: MessageCircle,
    telegram: ExternalLink,
    phone: Phone,
    email: Mail,
  };

  const socialColors = {
    facebook: "hover:bg-blue-500",
    instagram: "hover:bg-pink-500",
    whatsapp: "hover:bg-green-500",
    telegram: "hover:bg-blue-400",
    phone: "hover:bg-gray-600",
    email: "hover:bg-red-500",
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center">
          {/* Brand Section */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              Your Twist Zone
            </h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Transforming your style with premium service and expert care.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center items-center flex-wrap gap-4 mb-8">
            {Object.entries(socialLinks).map(([platform, link]) => {
              if (link === "#" || !link) return null;

              const IconComponent = socialIcons[platform];
              const hoverColor = socialColors[platform];

              return (
                <a
                  key={platform}
                  href={
                    platform === "email"
                      ? `mailto:${link}`
                      : platform === "phone"
                      ? `tel:${link}`
                      : link
                  }
                  target={
                    platform === "email" || platform === "phone"
                      ? "_self"
                      : "_blank"
                  }
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${hoverColor} border border-white/20`}
                  title={`Visit our ${platform}`}
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>by Your Twist Zone</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
