import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cream-300 bg-forest-800 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-200 text-forest-800">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold text-white">CareNest</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-mint-100/80">
              Care That Connects Hearts. Trusted companionship, joyful conversations, and everyday assistance for your elderly parents.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-mint-200">Platform</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/about" className="hover:text-white transition">About CareNest</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Our Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Become a Companion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-mint-200">Support</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Family Sign In</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Companion Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-mint-200">Get in Touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-peach-300" />
                <span>hello@carenest.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-peach-300" />
                <span>+91 20 6700 2200</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-peach-300" />
                <span>Pune</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-forest-700 pt-8 text-xs text-mint-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} CareNest Companionship Platform. All rights reserved.</p>
          <p>Non-medical elder companionship & family peace of mind.</p>
        </div>
      </div>
    </footer>
  );
}
