import { Link } from 'react-router-dom';
import { Sparkles, Upload, Image, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="fade-in">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">AI-Powered Urban Greening</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Cities into{' '}
              <span className="text-green-500">Green Havens</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Upload building footprint images and watch our AI generate beautiful 
              green satellite visualizations. Measure vegetation coverage and plan 
              sustainable urban development.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Upload</h3>
                  <p className="text-gray-600">Drag & drop building mask images</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Image className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Generation</h3>
                  <p className="text-gray-600">Pix2Pix GAN creates realistic green spaces</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Green Score Analysis</h3>
                  <p className="text-gray-600">Measure vegetation coverage percentage</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/upload"
                className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Generating
              </Link>
              <a
                href="#how-it-works"
                className="bg-white text-green-600 border-2 border-green-500 px-8 py-4 rounded-lg hover:bg-green-50 transition font-semibold text-center"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right: Visual/Image */}
          <div className="relative fade-in hidden md:block">
            <div className="relative">
              {/* Placeholder for demo image/animation */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
                <div className="space-y-4">
                  {/* Mock before/after visualization */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="bg-gray-200 h-40 rounded-lg mb-2 flex items-center justify-center">
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Building Mask</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-green-200 to-green-400 h-40 rounded-lg mb-2 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">AI Generated</p>
                    </div>
                  </div>

                  {/* Mock green score */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Green Score</span>
                      <span className="text-2xl font-bold text-green-600">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                100% Free
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;