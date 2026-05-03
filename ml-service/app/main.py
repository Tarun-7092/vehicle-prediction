from fastapi import FastAPI
from app.schemas import VehicleData
from app.predictor import predict_failure

app = FastAPI(
    title="Vehicle Failure Prediction API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "ML Service Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.post("/predict")
def predict(data: VehicleData):

    result = predict_failure(data.dict())

    return result