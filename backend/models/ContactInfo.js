import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: 'ZENTH' },
    heroKicker: { type: String, default: 'STREETWEAR' },
    heroHeadline: { type: String, default: 'DEFINE THE STREET' },
    heroTagline: { type: String, default: 'Limited drops. Premium fits. Built for the bold.' },
    footerTagline: { type: String, default: 'Streetwear for the bold. Built in the culture.' },
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
