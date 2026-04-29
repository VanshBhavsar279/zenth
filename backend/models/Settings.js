import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: '#0A0A0A' },
    secondaryColor: { type: String, default: '#E8FF00' },
    logoUrl: { type: String, default: '' },
    heroImagesMobile: { type: [String], default: [] },
    heroImagesDesktop: { type: [String], default: [] },
  },
  { timestamps: true }
);

/** Singleton document id */
settingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

export default mongoose.model('Settings', settingsSchema);
