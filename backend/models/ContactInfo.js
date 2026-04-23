import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: 'ZENTH' },
    whatsappNumber: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    instagramHandle: { type: String, default: '' },
    facebookHandle: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    aboutText: { type: String, default: '' },
  },
  { timestamps: true }
);

contactInfoSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

export default mongoose.model('ContactInfo', contactInfoSchema);
