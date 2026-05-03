import axios from 'axios';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
mlClient.interceptors.request.use(
  (config) => {
    logger.debug(`ML Service Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
mlClient.interceptors.response.use(
  (response) => {
    logger.debug(`ML Service Response: ${response.status}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    logger.error(`ML Service Error: ${error.message}`, {
      status,
      data,
      url: error.config?.url,
    });

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new AppError('ML prediction service is unavailable. Please try again later.', 503);
    }

    if (error.code === 'ECONNABORTED') {
      throw new AppError('ML prediction service timed out. Please try again later.', 504);
    }

    if (status === 422) {
      throw new AppError('Invalid sensor data sent to ML service.', 422);
    }

    throw new AppError(
      data?.detail || 'ML prediction service returned an error.',
      status || 502
    );
  }
);

/**
 * Call FastAPI ML service for a vehicle breakdown prediction
 * @param {Object} sensorData - Sensor readings
 * @returns {Object} { prediction, failure_probability, status }
 */
export const getPrediction = async (sensorData) => {
  const payload = {
    engine_rpm: sensorData.engine_rpm,
    lub_oil_pressure: sensorData.lub_oil_pressure,
    fuel_pressure: sensorData.fuel_pressure,
    coolant_pressure: sensorData.coolant_pressure,
    lub_oil_temp: sensorData.lub_oil_temp,
    coolant_temp: sensorData.coolant_temp,
  };

  const { data } = await mlClient.post('/predict', payload);

  // Validate ML response shape
  const required = ['prediction', 'failure_probability', 'status'];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null) {
      throw new AppError(`ML service returned incomplete response: missing '${field}'.`, 502);
    }
  }

  return {
    prediction: data.prediction,
    failure_probability: data.failure_probability,
    status: data.status,
  };
};

/**
 * Health check for ML service
 */
export const checkMLHealth = async () => {
  try {
    const { data } = await mlClient.get('/health');
    return { healthy: true, data };
  } catch {
    return { healthy: false };
  }
};