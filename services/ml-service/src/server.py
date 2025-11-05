from fastapi import FastAPI
from pydantic import BaseModel
import os

try:
    import tensorflow as tf
    TF_AVAILABLE = True
except Exception:
    TF_AVAILABLE = False

app = FastAPI(title="HealthConnect ML Service", version="1.0.0")
MODEL_PATH = os.environ.get("MODEL_PATH", "/app/model/model.h5")
model = None

class PredictRequest(BaseModel):
    symptoms: list[str]

class PredictResponse(BaseModel):
    prognosis: str
    confidence: float

@app.on_event("startup")
def load_model():
    global model
    if TF_AVAILABLE and os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Loaded TensorFlow model.")
        except Exception as e:
            print("Failed to load model (mock mode):", e)

@app.get("/health")
def health():
    return {"status": "ok", "tf_available": TF_AVAILABLE, "model_loaded": model is not None}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    labels = ["Common Cold", "Flu", "Allergy", "Migraine"]
    idx = hash(" ".join(req.symptoms)) % len(labels)
    conf = min(0.99, 0.5 + 0.05 * len(req.symptoms))
    return PredictResponse(prognosis=labels[idx], confidence=conf)
