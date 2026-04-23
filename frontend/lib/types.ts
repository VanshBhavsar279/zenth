export type ProductCategory =
  | 'Hoodies'
  | 'Tees'
  | 'Caps'
  | 'Bottoms'
  | 'Accessories';

export interface ColorVariant {
  _id?: string;
  name: string;
  hex: string;
  images: string[];
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  sizes: string[];
  colors: ColorVariant[];
  tags: string[];
  isFeatured: boolean;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

export interface ContactInfo {
  _id?: string;
  brandName: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  instagramHandle: string;
  facebookHandle: string;
  mapEmbedUrl: string;
  aboutText: string;
}
