from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
import numpy as np
import io
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow warnings

try:
    import tensorflow as tf
    from tensorflow import keras
except ImportError:
    raise ImportError("TensorFlow not installed. Run: pip install tensorflow-cpu")

app = FastAPI(title="Eco-Urbanist AI API", version="1.0.0")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL_PATH = "models/pix2pix_generator.h5"
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = keras.models.load_model(MODEL_PATH, compile=False)
            print(f"✅ Model loaded successfully from {MODEL_PATH}")
        else:
            print(f"⚠️ Model not found at {MODEL_PATH}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")

@app.get("/")
def read_root():
    return {
        "message": "Eco-Urbanist AI Backend is running! 🌳",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Upload a satellite/map image and get an eco-urbanized version.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read and preprocess image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        image = image.resize((256, 256))
        
        # Normalize to [-1, 1]
        img_array = np.array(image) / 127.5 - 1.0
        img_array = np.expand_dims(img_array, 0)
        
        # Predict
        prediction = model.predict(img_array, verbose=0)
        
        # Denormalize to [0, 255]
        output = ((prediction[0] + 1.0) * 127.5).astype(np.uint8)
        output_image = Image.fromarray(output)
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return StreamingResponse(img_byte_arr, media_type="image/png")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return {"error": "Model not loaded"}
    
    return {
        "model_type": "Pix2Pix Generator (U-Net)",
        "input_shape": [256, 256, 3],
        "output_shape": [256, 256, 3],
        "parameters": model.count_params() if hasattr(model, 'count_params') else "unknown"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))