import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Download, ArrowLeft, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { getGreenScoreColor, getGreenScoreLabel } from '../utils/helpers';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [inputPreview, setInputPreview] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [resultData, setResultData] = useState(null);

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
      await api.downloadImage(resultData.output_filename);
    }
  };

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const greenScores = resultData.green_scores || {};
  const inputScore = greenScores.input?.green_score || 0;
  const outputScore = greenScores.output?.green_score || 0;
  const improvement = greenScores.improvement || 0;

  // Chart data
  const chartData = [
    {
      name: 'Input',
      'Green Coverage': inputScore,
    },
    {
      name: 'Output',
      'Green Coverage': outputScore,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/upload"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Generate Another
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Generation Results
          </h1>
          <p className="text-xl text-gray-600">
            AI-generated green visualization with analysis
          </p>
        </div>

        {/* Image Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Before & After Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Image */}
            <div className="result-card-enter">
              <div className="text-center mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold">
                  Input: Building Mask
                </span>
              </div>
              {inputPreview && (
                <img
                  src={inputPreview}
                  alt="Input"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Green Score</p>
                <p className={`text-3xl font-bold ${getGreenScoreColor(inputScore)}`}>
                  {inputScore}%
                </p>
              </div>
            </div>

            {/* Output Image */}
            <div className="result-card-enter">
              <div className="text-center mb-4">
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  Output: AI Generated
                </span>
              </div>
              {outputUrl && (
                <img
                  src={outputUrl}
                  alt="Output"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Green Score</p>
                <p className={`text-3xl font-bold ${getGreenScoreColor(outputScore)}`}>
                  {outputScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleDownload}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition font-semibold inline-flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Result
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Green Score Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Green Coverage Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Green Coverage" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            {/* Improvement Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Improvement</p>
                  <p className="text-3xl font-bold text-green-600">
                    +{improvement.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Green Pixels Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Output Green Pixels</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {greenScores.output?.green_pixels?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div>
                <p className="text-gray-600 mb-2">Green Score Rating</p>
                <p className={`text-2xl font-bold ${getGreenScoreColor(outputScore)}`}>
                  {getGreenScoreLabel(outputScore)}
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${outputScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        {resultData.metadata && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-900 mb-2">
              ℹ️ Model Information
            </h3>
            <p className="text-yellow-800 text-sm">
              Model Status: <strong>{resultData.metadata.model_trained ? 'Trained' : 'Untrained (Random Weights)'}</strong>
            </p>
            <p className="text-yellow-800 text-sm mt-1">
              The model is currently using {resultData.metadata.model_trained ? 'trained' : 'untrained'} weights. 
              {!resultData.metadata.model_trained && ' For realistic results, train the model with satellite imagery data.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;