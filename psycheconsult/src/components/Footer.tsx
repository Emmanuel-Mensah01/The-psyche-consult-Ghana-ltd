import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-indigo-400"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </svg>
              <span className="text-xl font-bold">The Psyche Consult Ghana Ltd</span>
            </div>
            <p className="text-gray-400 mb-4">Your trusted partner for international education in Ghana.</p>
            <div className="flex gap-3">
              <a className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm" href="/student-portal">
                Student Login
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a className="hover:text-white transition-colors" href="/#services">University Selection</a></li>
              <li><a className="hover:text-white transition-colors" href="/#services">Application Support</a></li>
              <li><a className="hover:text-white transition-colors" href="/#services">Test Preparation</a></li>
              <li><a className="hover:text-white transition-colors" href="/#services">Visa Consulting</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a className="hover:text-white transition-colors" href="/countries">Study Destinations</a></li>
              <li><a className="hover:text-white transition-colors" href="/scholarships">Scholarships</a></li>
              <li><a className="hover:text-white transition-colors" href="/blog">Blog &amp; Resources</a></li>
              <li><a className="hover:text-white transition-colors" href="/booking">Book Appointment</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="font-semibold text-gray-300">Kumasi Office:</li>
              <li>Tanoso Station, Opposite MultiCredit</li>
              <li className="font-semibold text-gray-300 pt-2">Accra Office:</li>
              <li>Flower St. Tabora No.3</li>
              <li>Adjacent Orthodox Church</li>
              <li className="pt-2">info@thepsycheconsultgh.com</li>
              <li>+233 54 737 1731</li>
              <li>+233 50 323 4148</li>
              <li className="pt-2">
                <a
                  href="https://wa.me/233273664058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                  </svg>
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2026 The Psyche Consult Ghana Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
