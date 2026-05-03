import joblib
import numpy as np
from app.config import MODEL_PATH

# Load model
model = joblib.load(MODEL_PATH)

def predict_failure(data):

    features = np.array([[
        data["engine_rpm"],
        data["lub_oil_pressure"],
        data["fuel_pressure"],
        data["coolant_pressure"],
        data["lub_oil_temp"],
        data["coolant_temp"]
    ]])

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0][1]

    status = (
        "Vehicle Failure Likely"
        if prediction == 1
        else "Vehicle Operating Normally"
    )

    return {
        "prediction": int(prediction),
        "failure_probability": round(float(probability), 4),
        "status": status
    }