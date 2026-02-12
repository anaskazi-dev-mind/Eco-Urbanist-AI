import { Leaf, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Eco-Urbanist <span className="text-green-400">AI</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered urban planning tool that visualizes green spaces and 
              calculates vegetation coverage. Making cities more sustainable, 
              one image at a time.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@eco-urbanist.ai"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-green-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/upload" className="hover:text-green-400 transition">
                  Generate
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-green-400 transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-green-400 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-white font-semibold mb-4">Technology</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Pix2Pix GAN</li>
              <li className="text-gray-400">TensorFlow</li>
              <li className="text-gray-400">FastAPI</li>
              <li className="text-gray-400">React + Vite</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Eco-Urbanist AI. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> for a greener future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;