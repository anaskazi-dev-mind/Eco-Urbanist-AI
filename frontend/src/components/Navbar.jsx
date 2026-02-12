import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-green-500 p-2 rounded-lg group-hover:bg-green-600 transition">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Eco-Urbanist <span className="text-green-500">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-500 font-medium transition"
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className="text-gray-700 hover:text-green-500 font-medium transition"
            >
              Generate
            </Link>
            <Link 
              to="/upload" 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/upload"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-green-500 font-medium transition"
              >
                Generate
              </Link>
              <Link
                to="/upload"
                onClick={toggleMenu}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-medium text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;