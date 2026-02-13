from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image
import numpy as np
import io
import os
import time
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

def calculate_green_pixels(image_array):
    """Calculate number of green pixels in an image"""
    # Simple green detection: G > R and G > B
    r, g, b = image_array[:,:,0], image_array[:,:,1], image_array[:,:,2]
    green_mask = (g > r) & (g > b) & (g > 100)  # At least some green intensity
    return np.sum(green_mask)

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
        # Read and process input image
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert('RGB')
        input_image = input_image.resize((256, 256))
        
        # Calculate input green score
        input_array = np.array(input_image)
        input_green_pixels = calculate_green_pixels(input_array)
        input_total_pixels = 256 * 256
        input_green_score = (input_green_pixels / input_total_pixels) * 100
        
        # Prepare for model prediction
        img_array = input_array / 127.5 - 1.0
        img_array = np.expand_dims(img_array, 0)
        
        # Generate prediction
        prediction = model.predict(img_array, verbose=0)
        
        # Convert prediction to image
        output_array = ((prediction[0] + 1.0) * 127.5).astype(np.uint8)
        output_image = Image.fromarray(output_array)
        
        # Calculate output green score
        output_green_pixels = calculate_green_pixels(output_array)
        output_green_score = (output_green_pixels / input_total_pixels) * 100
        
        # Save output image
        output_filename = f"output_{int(time.time())}.png"
        output_path = Path("outputs") / output_filename
        output_path.parent.mkdir(exist_ok=True)
        output_image.save(output_path)
        
        # Calculate improvement
        improvement = output_green_score - input_green_score
        
        # Return JSON response
        return {
            "success": True,
            "output_filename": output_filename,
            "green_scores": {
                "input": {
                    "green_pixels": int(input_green_pixels),
                    "total_pixels": input_total_pixels,
                    "green_score": round(input_green_score, 2)
                },
                "output": {
                    "green_pixels": int(output_green_pixels),
                    "total_pixels": input_total_pixels,
                    "green_score": round(output_green_score, 2)
                },
                "improvement": round(improvement, 2)
            },
            "metadata": {
                "model_trained": True,
                "processing_time": "N/A"
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{filename}")
async def download_image(filename: str):
    """Download a generated image"""
    file_path = Path("outputs") / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="image/png", filename=filename)

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