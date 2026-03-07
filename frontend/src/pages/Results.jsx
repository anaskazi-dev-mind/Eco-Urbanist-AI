import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Download, ArrowLeft, TrendingUp, Image as ImageIcon, Leaf, TreePine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';
import { getGreenScoreColor, getGreenScoreLabel } from '../utils/helpers';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [inputPreview, setInputPreview] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Get data from navigation state
    const { result, inputFile } = location.state || {};

    if (!result) {
      // No data, redirect to upload
      navigate('/upload');
      return;
    }

    setResultData(result);

    // Set output image URL
    if (result.output_filename) {
      setOutputUrl(api.getDownloadUrl(result.output_filename));
    }

    // Create input preview
    if (inputFile) {
      const reader = new FileReader();
      reader.onload = (e) => setInputPreview(e.target.result);
      reader.readAsDataURL(inputFile);
    }
  }, [location, navigate]);

  // Download output image
  const handleDownload = async () => {
    if (resultData?.output_filename) {
      setIsDownloading(true);
      try {
        await api.downloadImage(resultData.output_filename);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download image. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const greenScores = resultData.green_scores || {};
  const inputScore = greenScores.input?.green_score || 0;
  const outputScore = greenScores.output?.green_score || 0;
  const improvement = greenScores.improvement || 0;
  const visualization = resultData.visualization || {};
  const treesPlaced = visualization.trees_placed || 0;
  const iconBreakdown = visualization.icon_breakdown || {};

  // Chart data for bar chart
  const chartData = [
    {
      name: 'Before',
      'Green Coverage (%)': parseFloat(inputScore.toFixed(2)),
    },
    {
      name: 'After',
      'Green Coverage (%)': parseFloat(outputScore.toFixed(2)),
    },
  ];

  // Pie chart data for icon breakdown
  const iconData = Object.entries(iconBreakdown)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));

  const COLORS = ['#22c55e', '#16a34a', '#15803d', '#14532d', '#65a30d'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="container-custom max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/upload"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Generate Another Visualization
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌳 Green Visualization Results
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered urban greening analysis complete
          </p>
        </div>

        {/* Success Banner */}
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-800">
                Visualization Generated Successfully!
              </h3>
              <p className="text-green-700 mt-1">
                Your image has been processed with {treesPlaced} tree icons placed strategically. 
                Green coverage improved by <strong>{improvement.toFixed(2)}%</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Image Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="w-6 h-6 mr-2 text-green-600" />
            Before & After Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Image */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold text-sm">
                  📸 Original Image
                </span>
              </div>
              {inputPreview ? (
                <div className="relative group">
                  <img
                    src={inputPreview}
                    alt="Input"
                    className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200 transition-transform group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No preview available</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Initial Green Coverage</p>
                <div className="flex items-center justify-between">
                  <p className={`text-3xl font-bold ${getGreenScoreColor(inputScore)}`}>
                    {inputScore.toFixed(2)}%
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGreenScoreColor(inputScore)} bg-opacity-10`}>
                    {getGreenScoreLabel(inputScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* Output Image */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
                  ✨ AI Enhanced
                </span>
              </div>
              {outputUrl ? (
                <div className="relative group">
                  <img
                    src={outputUrl}
                    alt="Output"
                    className="w-full h-auto rounded-lg shadow-lg border-2 border-green-200 transition-transform group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Loading output...</p>
                </div>
              )}
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Enhanced Green Coverage</p>
                <div className="flex items-center justify-between">
                  <p className={`text-3xl font-bold ${getGreenScoreColor(outputScore)}`}>
                    {outputScore.toFixed(2)}%
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGreenScoreColor(outputScore)} bg-opacity-10`}>
                    {getGreenScoreLabel(outputScore)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition font-semibold inline-flex items-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Enhanced Image'}
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Green Coverage Comparison Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Green Coverage Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
                <Bar dataKey="Green Coverage (%)" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Improvement: <span className="font-bold text-green-600">+{improvement.toFixed(2)}%</span>
              </p>
            </div>
          </div>

          {/* Tree Icon Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TreePine className="w-5 h-5 mr-2 text-green-600" />
              Tree Icon Distribution
            </h3>
            {iconData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={iconData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {iconData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                  {Object.entries(iconBreakdown).map(([type, count]) => (
                    count > 0 && (
                      <div key={type} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 capitalize">{type}</p>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <TreePine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No icon data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Improvement Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm">Total Improvement</p>
                <p className="text-4xl font-bold text-green-600">
                  +{improvement.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Green coverage increase</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Green Pixels Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm">Green Pixels Added</p>
                <p className="text-4xl font-bold text-blue-600">
                  {((greenScores.output?.green_pixels || 0) - (greenScores.input?.green_pixels || 0)).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Additional green coverage</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Trees Placed Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm">Trees Placed</p>
                <p className="text-4xl font-bold text-emerald-600">
                  {treesPlaced}
                </p>
                <p className="text-xs text-gray-500 mt-1">AI-positioned icons</p>
              </div>
              <div className="bg-emerald-100 p-4 rounded-full">
                <TreePine className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Green Coverage Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Original</span>
                <span className="font-medium">{inputScore.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gray-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${inputScore}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Enhanced</span>
                <span className="font-medium text-green-600">{outputScore.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${outputScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Info (Optional) */}
        {resultData.metadata && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Processing Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <p><strong>Processing Time:</strong> {resultData.metadata.processing_time || 'N/A'}</p>
                <p><strong>Image Size:</strong> {resultData.metadata.original_size || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Version:</strong> {resultData.metadata.version || 'N/A'}</p>
                <p><strong>Method:</strong> AI-guided visualization</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;