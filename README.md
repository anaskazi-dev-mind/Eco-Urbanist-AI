# 🌳 Eco-Urbanist AI - Green Space Planning Reimagined

<div align="center">

![Eco-Urbanist AI Banner](https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=tensorflow)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Transforming Urban Landscapes with AI-Powered Green Space Visualization**

[🚀 Try Live Demo](https://eco-urbanist-ai-v1.onrender.com) • [📖 Documentation](#documentation) • [🎥 Demo Video](#demo)

</div>

---

## 🌍 **The Problem**

Currently, green space planning in rapidly expanding modern cities is largely a **manual and time-consuming process**. This often results in city layouts that prioritize roads and buildings, adding greenery only as an afterthought.

### Environmental Consequences:

- 🔥 **Urban Heat Island (UHI) Effect**: Concrete retains heat and raises local temperatures
- 💨 **Reduced Air Quality**: Lack of natural filtration and carbon absorption
- 🌊 **Flooding Risks**: Poor stormwater absorption due to lack of permeable surfaces
- 🌡️ **Climate Impact**: Increased energy consumption for cooling

---

## 💡 **The Solution: Eco-Urbanist AI**

**Eco-Urbanist AI** is an intelligent system that combines **computer vision** and **generative AI** to automatically produce green-enhanced versions of city layouts or satellite images.

### ✨ Key Features:

#### 🏗️ **Infrastructure-Aware Planning**
- Automatically detects and **preserves existing infrastructure** (buildings, roads, water bodies)
- Suggests new vegetation only in **feasible open spaces**
- Smart placement algorithm respects urban constraints

#### 📊 **Measurable Impact**
- Calculates **quantifiable metrics** for green coverage
- Provides **before/after comparison** percentages
- Estimates environmental improvements

#### ⚡ **Instant Visualization**
- Transforms **days/weeks of manual planning** into **seconds**
- Real-time AI processing
- Interactive results display

---

## 🎯 **Target Audience**

This system is designed as a **decision-support tool** for:

- 🏙️ **Urban Planners** and City Development Authorities
- 🏛️ **Architects** and Landscape Architects
- 🌱 **Environmental & Sustainability Teams**
- 🗺️ **Smart City & GIS Analysts**
- 🎓 **Students & Researchers** studying urban optimization

---

## 🛠️ **Technology Stack**

### **Backend:**
- 🐍 **Python** - Core programming language
- ⚡ **FastAPI** - Modern, fast web framework
- 🦄 **Uvicorn** - ASGI server for production

### **AI & Machine Learning:**
- 🧠 **TensorFlow & Keras** - Deep learning framework
- 🎨 **GAN Architecture**:
  - **Pix2Pix** components
  - **U-Net Generator** for image transformation
  - **PatchGAN Discriminator** for quality validation
- 📚 **Trained on**: DeepGlobe Land Cover Classification Dataset

### **Computer Vision:**
- 👁️ **OpenCV** - Image processing and analysis
- 🔢 **NumPy** - Numerical computations
- 🖼️ **Pillow (PIL)** - Image manipulation

### **Frontend:**
- ⚛️ **React** - Modern UI framework
- 🎨 **Tailwind CSS** - Utility-first styling
- 🚀 **Vite** - Lightning-fast build tool
- 📡 **Axios** - HTTP client

---

## 🚀 **Quick Start**

### **Prerequisites:**
- Python 3.8+
- Node.js 16+
- Git

### **Installation:**

```bash
# Clone the repository
git clone https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI.git
cd Eco-Urbanist-AI

# Backend Setup
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt

# Frontend Setup
cd ../frontend
npm install
```

### **Running Locally:**

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📸 **How It Works**

### **Step 1: Upload Satellite Image**
Upload an aerial/satellite view of any urban area (supports PNG, JPEG)

### **Step 2: AI Processing**
The system:
1. **Detects** existing infrastructure (buildings, roads, water)
2. **Identifies** feasible green space locations
3. **Generates** optimized vegetation placement
4. **Calculates** environmental impact metrics

### **Step 3: View Results**
- Interactive before/after comparison
- Detailed green coverage statistics
- Download enhanced visualization

---

## 🎨 **Demo**

### **Live Application:**
👉 **[Try Eco-Urbanist AI](https://eco-urbanist-ai-v1.onrender.com)**

### **GitHub Repository:**
👉 **[View Source Code](https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI)**

---

## 📊 **System Architecture**

```
┌─────────────────┐
│   User Upload   │
│  (Satellite Img)│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Computer Vision Analysis      │
│  ┌──────────────────────────┐  │
│  │ Building Detection       │  │
│  │ Road Detection           │  │
│  │ Water Body Detection     │  │
│  │ Safety Zone Calculation  │  │
│  └──────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   GAN Model Processing          │
│  ┌──────────────────────────┐  │
│  │ U-Net Generator          │  │
│  │ Green Space Prediction   │  │
│  │ Smart Icon Placement     │  │
│  └──────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Output Generation             │
│  • Enhanced Visualization       │
│  • Green Coverage Metrics       │
│  • Before/After Comparison      │
└─────────────────────────────────┘
```

---

## 🔮 **Future Roadmap**

### **Phase 1: Enhanced Visualization**
- 🏗️ **3D Visualization & Digital Twins**
  - Upgrade from 2D to 3D models
  - Analyze canopy heights and shadow casting
  - Temperature impact simulation

### **Phase 2: Advanced Metrics**
- 🌿 **Carbon Sequestration Estimates**
- 🌡️ **Temperature Reduction Forecasts**
- 💧 **Rainwater Retention Calculations**
- 🌬️ **Air Quality Improvement Predictions**

### **Phase 3: Interactive Features**
- 🖌️ **Green Painting Tool**
  - Manual brush tool for user-directed greenery
  - Custom park and tree line placement
  - Real-time AI adaptation

### **Phase 4: API Integration**
- 🗺️ **Satellite API Integration**
  - Direct connection to Google Maps/Mapbox
  - Address-based image retrieval
  - Automated urban area analysis

### **Phase 5: Model Refinement**
- 🎨 **Enhanced GAN Training**
  - More diverse datasets
  - Photorealistic texture generation
  - Multi-climate adaptation

---

## 📁 **Project Structure**

```
Eco-Urbanist-AI/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── model.py             # GAN model definition
│   ├── requirements.txt     # Python dependencies
│   ├── tree_icons/          # Vegetation assets
│   └── outputs/             # Generated images
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   └── utils/           # Helper functions
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Anas Kazi**
- GitHub: [@anaskazi-dev-mind](https://github.com/anaskazi-dev-mind)
- Project Link: [Eco-Urbanist AI](https://github.com/anaskazi-dev-mind/Eco-Urbanist-AI)

---

## 🙏 **Acknowledgments**

- DeepGlobe Land Cover Classification Dataset
- TensorFlow & Keras Community
- React & Vite Communities
- OpenCV Contributors

---

<div align="center">

**Made with 💚 for a Greener Future**

[⬆ Back to Top](#-eco-urbanist-ai---green-space-planning-reimagined)

</div>