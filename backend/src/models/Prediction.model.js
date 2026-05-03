import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    // ─── Sensor Input Data ───────────────────────────────────────────────
    engine_rpm: {
      type: Number,
      required: [true, 'Engine RPM is required'],
      min: [0, 'Engine RPM cannot be negative'],
      max: [10000, 'Engine RPM cannot exceed 10000'],
    },
    lub_oil_pressure: {
      type: Number,
      required: [true, 'Lub oil pressure is required'],
      min: [0, 'Lub oil pressure cannot be negative'],
    },
    fuel_pressure: {
      type: Number,
      required: [true, 'Fuel pressure is required'],
      min: [0, 'Fuel pressure cannot be negative'],
    },
    coolant_pressure: {
      type: Number,
      required: [true, 'Coolant pressure is required'],
      min: [0, 'Coolant pressure cannot be negative'],
    },
    lub_oil_temp: {
      type: Number,
      required: [true, 'Lub oil temperature is required'],
    },
    coolant_temp: {
      type: Number,
      required: [true, 'Coolant temperature is required'],
    },
    // ─── ML Response Data ────────────────────────────────────────────────
    prediction: {
      type: Number,
      required: [true, 'Prediction value is required'],
    },
    failure_probability: {
      type: Number,
      required: [true, 'Failure probability is required'],
      min: [0, 'Probability cannot be negative'],
      max: [1, 'Probability cannot exceed 1'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Normal', 'Warning', 'Critical', 'Failure'],
        message: 'Status must be Normal, Warning, Critical, or Failure',
      },
    },
    // ─── Metadata ─────────────────────────────────────────────────────────
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ status: 1 });
predictionSchema.index({ failure_probability: -1 });
predictionSchema.index({ createdAt: -1 });

// ─── Virtual: Risk Level ──────────────────────────────────────────────────────
predictionSchema.virtual('riskLevel').get(function () {
  if (this.failure_probability >= 0.8) return 'Critical';
  if (this.failure_probability >= 0.5) return 'High';
  if (this.failure_probability >= 0.3) return 'Medium';
  return 'Low';
});

// ─── Static: Summary Stats ────────────────────────────────────────────────────
predictionSchema.statics.getUserStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        failures: { $sum: { $cond: [{ $ne: ['$status', 'Normal'] }, 1, 0] } },
        avgProbability: { $avg: '$failure_probability' },
      },
    },
  ]);
};

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;