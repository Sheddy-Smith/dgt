"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Info,
  Home,
  PlusCircle,
  Package,
  Wallet,
  HelpCircle,
  Shield,
  AlertTriangle,
  FileText,
  Lock,
  Cookie
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* About Section */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 md:w-5 md:h-5" />
              About DGT
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              DamageThings.com (DGT) is an Indian online marketplace for buying and selling damaged, used, and repairable goods. Our platform promotes trust through token-based contact unlocks, verified listings, and a transparent buyer-seller ecosystem.
            </p>
            <p className="text-xs text-gray-400 italic mt-2">
              Registered by: Sheddy Smith Lab
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <Home className="w-3 h-3 md:w-4 md:h-4" />
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = '/post-listing'}
                  className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Post Ad
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = '/my-listings'}
                  className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <Package className="w-3 h-3 md:w-4 md:h-4" />
                  My Listings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = '/wallet'}
                  className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <Wallet className="w-3 h-3 md:w-4 md:h-4" />
                  Wallet
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-white">Help & Support</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Shield className="w-3 h-3 md:w-4 md:h-4" />
                  Safety Tips
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Phone className="w-3 h-3 md:w-4 md:h-4" />
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                  Report Abuse
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  Terms of Use
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Lock className="w-3 h-3 md:w-4 md:h-4" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Cookie className="w-3 h-3 md:w-4 md:h-4" />
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-gray-700" />

        {/* Newsletter Section */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-lg p-4 md:p-6 border border-gray-700">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-center lg:text-left">
                <h4 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">
                  Stay Updated
                </h4>
                <p className="text-xs md:text-sm text-gray-300">
                  Get the latest deals and updates delivered to your inbox
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 w-full lg:w-64 h-10 text-sm"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-10 px-4 text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Subscribe
                </Button>
              </form>
            </div>
            {subscribed && (
              <div className="mt-3 text-green-400 text-xs md:text-sm text-center">
                ✓ Successfully subscribed!
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-white">Email Support</p>
              <p className="text-xs md:text-sm text-gray-400">Support@DamageThings.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="bg-green-600/20 p-2 rounded-lg">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-white">Customer Support</p>
              <p className="text-xs md:text-sm text-gray-400">+91 7447 000 198</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="bg-orange-600/20 p-2 rounded-lg">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-white">Address</p>
              <p className="text-xs md:text-sm text-gray-400">Indore, Madhya Pradesh</p>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs md:text-sm">
            <div>
              <p className="text-gray-400 mb-1">
                <span className="text-white font-semibold">Company:</span> DamageThings.com (DGT)
              </p>
              <p className="text-gray-400 mb-1">
                <span className="text-white font-semibold">Operated by:</span> Sheddy Smith Lab
              </p>
              <p className="text-gray-400">
                <span className="text-white font-semibold">Established:</span> 2025
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">
                <span className="text-white font-semibold">Full Address:</span>
              </p>
              <p className="text-gray-300">
                MalwaTrolley, 122/1, AB Byepass Road,<br />
                Indore – 452020, Madhya Pradesh, India
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">
                <span className="text-white font-semibold">Customer Promise:</span>
              </p>
              <ul className="space-y-1 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>100% Secure Payments via Razorpay</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Verified Seller Listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>24×7 Support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>User Data Protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-700">
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm text-gray-400">
              © {new Date().getFullYear()} DamageThings.com — All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Headquarters: Indore, Madhya Pradesh, India | Website: www.DamageThings.com
            </p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="bg-gray-800 hover:bg-blue-400 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <Instagram className="w-4 h-4" />
            </button>
            <button className="bg-gray-800 hover:bg-red-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <Youtube className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}