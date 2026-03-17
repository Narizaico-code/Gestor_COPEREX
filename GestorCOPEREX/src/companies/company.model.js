import mongoose, { Schema } from 'mongoose';

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    impactLevel: {
      type: String,
      required: true,
      enum: ['alto', 'medio', 'bajo'],
      lowercase: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
      max: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    addedBy: {
      type: String,
      trim: true,
      default: null,
    },
    logo: {
      url: { type: String, trim: true, default: null },
      publicId: { type: String, trim: true, default: null },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 400,
      default: '',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

companySchema.index({ name: 'text', category: 'text' });
companySchema.index({ name: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });

export default mongoose.model('Company', companySchema);
