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
    <footer className="bg-white border-t border-gray-200 text-gray-700 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 md:py-12">
        {/* Our Vision Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 max-w-4xl mx-auto">
            To make India's first "token-based marketplace" where every used or damaged product can find new value.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-blue-200 bg-blue-50">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Trust-Based</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-green-200 bg-green-50">
              <Info className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Community-Driven</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-purple-200 bg-purple-50">
              <Package className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Est. 2025</span>
            </div>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-gray-200" />
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* About Section */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Info className="w-4 h-4 md:w-5 md:h-5" />
              About DGT
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              DamageThings.com (DGT) is an Indian online marketplace for buying and selling damaged, used, and repairable goods. Our platform promotes trust through token-based contact unlocks, verified listings, and a transparent buyer-seller ecosystem.
            </p>
            <p className="text-xs text-gray-500 italic mt-2">
              Registered by: Sheddy Smith Lab
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button
                  onClick={() => window.location.href = '/'}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                >
                  <Home className="w-3 h-3 md:w-4 md:h-4" />
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/post-listing'}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                >
                  <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Post Ad
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/my-listings'}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                >
                  <Package className="w-3 h-3 md:w-4 md:h-4" />
                  My Listings
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/wallet'}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                >
                  <Wallet className="w-3 h-3 md:w-4 md:h-4" />
                  Wallet
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Help & Support</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Help Center
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <Shield className="w-3 h-3 md:w-4 md:h-4" />
                  Safety Tips
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <Phone className="w-3 h-3 md:w-4 md:h-4" />
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                  Report Abuse
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  Terms of Use
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <Lock className="w-3 h-3 md:w-4 md:h-4" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                  <Cookie className="w-3 h-3 md:w-4 md:h-4" />
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-gray-200" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2025 DamageThings.com • All Rights Reserved • Operated by Sheddy Smith Lab
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-gray-500">
              <button className="hover:text-gray-900 transition-colors">Terms of Use</button>
              <span>•</span>
              <button className="hover:text-gray-900 transition-colors">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-gray-900 transition-colors">Cookie Policy</button>
              <span>•</span>
              <button className="hover:text-gray-900 transition-colors">Contact Us</button>
              <span>•</span>
              <button className="hover:text-gray-900 transition-colors">About Us</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Registered by Sheddy Smith Lab • Indore, Madhya Pradesh, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}