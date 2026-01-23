export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Service System</h3>
            <p className="text-gray-400">
              Professional vehicle service management system providing reliable
              and efficient service solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact & Support</h3>
            <p className="text-gray-400 mb-2">
              📞 <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p className="text-gray-400 mb-2">
              📧 <strong>Email:</strong> support@servicesystem.com
            </p>
            <p className="text-gray-400">
              🕐 <strong>Hours:</strong> Mon-Sat 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="text-center text-gray-400">
            <p>
              &copy; 2026 Service System. All rights reserved. | Privacy Policy
              | Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
