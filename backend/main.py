from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import numpy as np
import io
import os
from pathlib import Path

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import tensorflow as tf
    from tensorflow import keras
except ImportError:
    raise ImportError("TensorFlow not installed")

app = FastAPI(title="Eco-Urbanist AI", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = "models/pix2pix_generator.h5"
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = keras.models.load_model(MODEL_PATH, compile=False)
            print(f"✅ Model loaded from {MODEL_PATH}")
        else:
            print(f"⚠️ Model not found at {MODEL_PATH}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")

# API endpoints
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        image = image.resize((256, 256))
        
        img_array = np.array(image) / 127.5 - 1.0
        img_array = np.expand_dims(img_array, 0)
        
        prediction = model.predict(img_array, verbose=0)
        
        output = ((prediction[0] + 1.0) * 127.5).astype(np.uint8)
        output_image = Image.fromarray(output)
        
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return StreamingResponse(img_byte_arr, media_type="image/png")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model-info")
def model_info():
    if model is None:
        return {"error": "Model not loaded"}
    
    return {
        "model_type": "Pix2Pix Generator",
        "input_shape": [256, 256, 3],
        "output_shape": [256, 256, 3]
    }

# Serve static files from frontend/dist
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

print(f"🔍 Looking for frontend at: {FRONTEND_DIST}")
print(f"📁 Frontend exists: {FRONTEND_DIST.exists()}")

if FRONTEND_DIST.exists():
    # Mount static assets
    assets_path = FRONTEND_DIST / "assets"
    if assets_path.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_path)), name="assets")
        print(f"✅ Mounted /assets from {assets_path}")
    
    # Serve index.html for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't serve frontend for API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        
        # Try to serve the specific file
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        
        # Fallback to index.html for React Router
        index_path = FRONTEND_DIST / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        raise HTTPException(status_code=404, detail="Frontend not found")
else:
    print(f"⚠️ Frontend dist folder not found at {FRONTEND_DIST}")
    
    @app.get("/")
    def root():
        return {
            "message": "Eco-Urbanist AI Backend is running! 🌳",
            "version": "1.0.0",
            "model_loaded": model is not None,
            "endpoints": {
                "health": "/api/health",
                "predict": "/api/predict (POST)"
            },
            "warning": "Frontend not deployed. Build frontend with: cd frontend && npm run build"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))