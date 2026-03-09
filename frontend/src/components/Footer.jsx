import { Leaf, Github, Heart, Sparkles, ExternalLink, Linkedin, Code2, Rocket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 border-t-4 border-green-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container-custom py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-10">
          
          {/* About Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg transform hover:rotate-12 transition-all duration-300">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                Eco-Urbanist <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed text-base">
              🌍 AI-powered urban planning tool that transforms cities into green havens. 
              Visualize green spaces, calculate vegetation coverage, and plan sustainable urban development with cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="space-y-5">
              <p className="text-sm font-black text-green-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Connect With Us
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {/* GitHub */}
                <a
                  href="https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-gray-800 px-5 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl border border-gray-700 hover:border-green-500"
                  title="View Source Code on GitHub"
                >
                  <Github className="w-5 h-5 group-hover:text-green-400 transition-colors" />
                  <span className="text-sm font-bold">GitHub</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/anaskazi001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-blue-500/50 border-2 border-blue-500"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">LinkedIn</span>
                </a>
              </div>

              {/* Star on GitHub CTA */}
              <a
                href="https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 px-6 py-3 rounded-xl hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-400 transition-all backdrop-blur-sm transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-sm font-black text-green-400">⭐ Star this project on GitHub</span>
                <ExternalLink className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Team Badge */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 px-5 py-4 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  College Project Team
                </p>
                <a 
                  href="https://github.com/anaskazi-dev-mind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-black text-white hover:text-green-400 transition-colors flex items-center gap-2 mb-1"
                >
                  <Code2 className="w-4 h-4" />
                  Anas Kazi & Team
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-xs text-gray-400">Built with passion by students 🎓</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black mb-6 text-lg flex items-center">
              <span className="bg-gradient-to-b from-green-400 to-green-600 w-1.5 h-7 mr-3 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="group flex items-center hover:text-green-400 transition-all font-semibold text-gray-400"
                >
                  <span className="mr-2 text-green-500 group-hover:translate-x-2 transition-transform">→</span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className="group flex items-center hover:text-green-400 transition-all font-semibold text-gray-400"
                >
                  <span className="mr-2 text-green-500 group-hover:translate-x-2 transition-transform">→</span>
                  Upload Image
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center hover:text-green-400 transition-all font-semibold text-gray-400"
                >
                  <span className="mr-2 text-green-500 group-hover:translate-x-2 transition-transform">→</span>
                  Source Code
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center hover:text-green-400 transition-all font-semibold text-gray-400"
                >
                  <span className="mr-2 text-green-500 group-hover:translate-x-2 transition-transform">→</span>
                  Documentation
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center hover:text-green-400 transition-all font-semibold text-gray-400"
                >
                  <span className="mr-2 text-green-500 group-hover:translate-x-2 transition-transform">→</span>
                  Report Issues
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="text-white font-black mb-6 text-lg flex items-center">
              <span className="bg-gradient-to-b from-green-400 to-green-600 w-1.5 h-7 mr-3 rounded-full"></span>
              Tech Stack
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400 hover:text-green-400 transition-all group">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/50"></span>
                <span className="font-semibold">Pix2Pix GAN</span>
              </li>
              <li className="flex items-center text-gray-400 hover:text-green-400 transition-all group">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/50"></span>
                <span className="font-semibold">TensorFlow AI</span>
              </li>
              <li className="flex items-center text-gray-400 hover:text-green-400 transition-all group">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/50"></span>
                <span className="font-semibold">Python + FastAPI</span>
              </li>
              <li className="flex items-center text-gray-400 hover:text-green-400 transition-all group">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/50"></span>
                <span className="font-semibold">React + Vite</span>
              </li>
              <li className="flex items-center text-gray-400 hover:text-green-400 transition-all group">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/50"></span>
                <span className="font-semibold">Tailwind CSS</span>
              </li>
              <li className="flex items-center text-gray-400 hover:text-green-400 transition-all group">
                <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 group-hover:scale-150 transition-transform shadow-lg shadow-green-500/50"></span>
                <span className="font-semibold">OpenCV</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-14 pt-10 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800 transition-all transform hover:scale-110 hover:-translate-y-2 border-2 border-gray-700 hover:border-green-500 shadow-lg hover:shadow-green-500/30">
              <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">1000+</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Images Processed</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800 transition-all transform hover:scale-110 hover:-translate-y-2 border-2 border-gray-700 hover:border-green-500 shadow-lg hover:shadow-green-500/30">
              <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">95%</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Accuracy Rate</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800 transition-all transform hover:scale-110 hover:-translate-y-2 border-2 border-gray-700 hover:border-green-500 shadow-lg hover:shadow-green-500/30">
              <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">100%</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Free Forever</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800 transition-all transform hover:scale-110 hover:-translate-y-2 border-2 border-gray-700 hover:border-green-500 shadow-lg hover:shadow-green-500/30">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">🎓</div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">College Project</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <p className="text-gray-400 text-sm font-semibold">
              © {currentYear} Eco-Urbanist AI. All rights reserved.
            </p>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-400 text-sm flex items-center font-semibold">
                Built with <Heart className="w-5 h-5 mx-2 text-red-500 fill-current animate-pulse" /> by{' '}
                <a 
                  href="https://github.com/anaskazi-dev-mind" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-green-400 hover:text-green-300 font-bold transition-colors"
                >
                  Anas Kazi & Team
                </a>
              </p>
              <span className="text-gray-500 text-xs bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
                🎓 Academic Project
              </span>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-4 font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4 text-green-500" />
              Powered by Modern Technologies
            </p>
            <div className="flex justify-center gap-2.5 flex-wrap">
              <span className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-full text-xs font-black text-gray-300 border-2 border-gray-700 hover:border-green-500 transition-all shadow-lg">🐍 Python</span>
              <span className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-full text-xs font-black text-gray-300 border-2 border-gray-700 hover:border-green-500 transition-all shadow-lg">⚛️ React</span>
              <span className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-full text-xs font-black text-gray-300 border-2 border-gray-700 hover:border-green-500 transition-all shadow-lg">🤖 TensorFlow</span>
              <span className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-full text-xs font-black text-gray-300 border-2 border-gray-700 hover:border-green-500 transition-all shadow-lg">⚡ FastAPI</span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full text-xs font-black text-white border-2 border-green-400 shadow-lg shadow-green-500/50 animate-pulse">💚 Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;