import { Link } from './Router';
import logo from '../assets/images/logo.png';
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src= {logo} alt="Royalton Gold Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">Royalton Gold Security and Shipping</span>
            </div>
            <p className="text-gray-400 text-sm">
              Reliable, on-time, and transparent shipping for every voyage.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/domestic" className="text-gray-400 hover:text-orange-600">
                  Domestic Shipping
                </Link>
              </li>
              <li>
                <Link to="/services/international" className="text-gray-400 hover:text-orange-600">
                  International Shipping
                </Link>
              </li>
              <li>
                <Link to="/services/express" className="text-gray-400 hover:text-orange-600">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link to="/services/freight" className="text-gray-400 hover:text-orange-600">
                  Freight & Cargo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/track" className="text-gray-400 hover:text-orange-600">
                  Track Package
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-gray-400 hover:text-orange-600">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-gray-400 hover:text-orange-600">
                  Find Location
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-orange-600">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-orange-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-orange-600">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-orange-600">
                  About Us
                </Link>
              </li>
            </ul>
                {/* <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-orange-600">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-orange-600">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-orange-600">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-orange-600">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div> */}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Royalton Gold Security and Shipping Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
